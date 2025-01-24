"use client";
import { useState } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Check,
    X,
    Mail,
    Phone,
    Briefcase,
    Clock,
} from "lucide-react";

const ApplicationsList = ({ applications, listingId }) => {
    const [activeTab, setActiveTab] = useState("all");
    const { toast } = useToast();

    const filterApplications = (status) => {
        if (status === "all") return applications;
        return applications.filter(app => app.status === status);
    };

    const handleStatusUpdate = async (applicationId, newStatus) => { 
        try {
            const response = await fetch('/api/applications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId, status: newStatus })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update application status');
            }

            window.location.reload();
            
            toast({
                title: "Status Updated",
                description: `Application ${newStatus} successfully`,
            });
        } catch (error) {
            console.error('Error updating status:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to update application status",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    <div className="grid gap-4">
                        {filterApplications(activeTab).map((application) => (
                            <Card key={application._id} className="overflow-hidden">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Image
                                        src={application.applicant.image}
                                        alt={application.applicant.name}
                                        width={60}
                                        height={60}
                                        className="rounded-full"
                                    />
                                    <div className="flex-1">
                                        <CardTitle>{application.applicant.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Applied on {formatDate(application._createdAt)}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        {application.status === 'pending' && (
                                            <>
                                                <Button
                                                    onClick={() => handleStatusUpdate(application._id, 'approved')}
                                                    variant="default"
                                                    size="sm"
                                                    className="gap-2"
                                                >
                                                    <Check className="h-4 w-4" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                                    variant="destructive"
                                                    size="sm"
                                                    className="gap-2"
                                                >
                                                    <X className="h-4 w-4" />
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <p>{application.applicant.email}</p>
                                        </div>
                                        {application.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <p>{application.phone}</p>
                                            </div>
                                        )}
                                        {application.occupation && (
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-gray-500" />
                                                <p>{application.occupation}</p>
                                            </div>
                                        )}
                                    </div>
                                    {application.message && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-600">{application.message}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ApplicationsList; 