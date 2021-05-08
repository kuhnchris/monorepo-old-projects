import json
from graphqlclient import GraphQLClient
import config
from import2wekan import WekanAPIWraper


def read_github_via_graphql(ep, arr=[], cursor=""):
    """
    Reads GitHub data via GraphQL, requires token!
    :param ep: Entrypoint
    :param arr: Result array
    :param cursor: 'cursor', see source for explaination
    """

    # Defining variables etc.
    client = GraphQLClient(ep)

    clientVar = {}
    if cursor:
        clientVar = {"endCursor": cursor}

    # Inject Github Token
    client.inject_token("bearer " + config.TOKEN)

    # execution...
    result = client.execute(config.QUERY, clientVar)

    # loads result
    f = json.loads(result)

    # TODO - Adapt to your needs / QL!
    for obj in f["data"]["repository"]["issues"]["nodes"]:
        arr.append(obj)

    ''' uncomment this if you want to 'loop' via next cursor, requires pageInfo object in QL '''
    # page_ctx = f["data"]["repository"]["issues"]["pageInfo"]
    # if page_ctx['hasNextPage']:
    #   next_cursor = page_ctx['endCursor']
    #   read_github_via_graphql(ep, arr, next_cursor)


# definitions
myArr = []
wekanAPI = WekanAPIWraper()

# Github part!
# ~~~~~~~~~~~

# load data from Github via GraphQL language
read_github_via_graphql('https://api.github.com/graphql', myArr)

# Wekan part!
# ~~~~~~~~~~~

# write cards to Wekan: TODO - Adapt to your use-case!
for entry in myArr:
    title = f"#{entry['number']} {entry['title']}"
    descr = f"{entry['bodyText']}"
    wekanAPI.add_card(title,descr)

# alternative: write to disk/json/...
# f = open("github.json","w")
# f.write(json.dumps(myArr))
# print("wrote to file.")