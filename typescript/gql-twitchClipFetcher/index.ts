import { GraphQLClient, gql } from 'graphql-request'

async function main() {
  var nextCursor = null;
  let firstTime = true;
  while (nextCursor !== null || firstTime == true) {
    const endpoint = 'https://gql.twitch.tv/gql  '

    // grab from website - look at network tab, grab "gql" request section "authroization (OAuth xxxxx)"
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: 'OAuth xxx',
      },
    })

    const query = gql`
    query {
      user(login: "timbeaudet") {
          clips(criteria: { filter: ALL_TIME }, first: 20` + ((nextCursor !== null)?`, after:"`+ nextCursor + `"`:"") + `) {
            edges {
              node {
                url
                title
                createdAt

              }
              cursor
            }
          }
      }
    }
  `

    const data = await graphQLClient.request(query)

    nextCursor = null;
    firstTime = false;
    
    data.user.clips.edges.forEach(element => {
      if (element.cursor !== null)
        nextCursor = element.cursor;
      console.log(element.node.url + ` - ` + element.node.title + ` - ` + element.node.createdAt);
    });
  }
  //console.log(JSON.stringify(data, undefined, 2))
}

main().catch((error) => console.error(error))