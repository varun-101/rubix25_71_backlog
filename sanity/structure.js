// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('user').title('Users'),
      S.documentTypeListItem('listing').title('Listing'),
      S.documentTypeListItem('application').title('Application'),
    ])
