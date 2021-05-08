TOKEN = "github-token12345"
WEKAN_URL = "https://wekan.fullurl.com/wekan-path"
WEKAN_USER = "user"
WEKAN_PASS = "pass"
WEKAN_BOARD_TITLE = "MyBoard"
WEKAN_SWIMLANE_TITLE = "Default"
WEKAN_LIST_TITLE = "Github Incoming"
QUERY = '''
query ($endCursor: String){
  repository(owner: "gitcoinco", name: "web") {
    issues(last: 10, after: $endCursor) {
      nodes {
        title
        state
        number
        url
        bodyText
        comments(first: 10) {
          nodes {
            author {
              login
            }
            bodyText
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
'''