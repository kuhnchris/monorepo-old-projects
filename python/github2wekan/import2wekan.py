import requests
import config as app_config

''' 
    Class 'WekanAPI' mercilessly ripped from https://github.com/wekan/wekan-python-api-client
    Basically it's a wrapper for a wrapper for a API which is a wrapper for a database.
    d'oh.
'''
class WekanApi:
    def api_call(self, url, data=None, authed=True):
        if data is None:
            api_response = self.session.get(
                "{}{}".format(self.api_url, url),
                headers={"Authorization": "Bearer {}".format(self.token)},
                proxies=self.proxies
            )
        else:
            api_response = self.session.post(
                "{}{}".format(self.api_url, url),
                data=data,
                headers={"Authorization": "Bearer {}".format(self.token)} if authed else {},
                proxies=self.proxies
            )

        # for debugging:
        # print(api_response)

        if api_response.status_code == 200:
            return api_response.json()
        else:
            print("api error occoured.")

    def __init__(self, api_url, credentials, proxies=None):
        if proxies is None:
            proxies = {}
        self.session = requests.Session()
        self.proxies = proxies
        self.api_url = api_url
        api_login = self.api_call("/users/login", data=credentials, authed=False)
        self.token = api_login["token"]
        self.user_id = api_login["id"]

    def get_user_boards(self):
        boards_data = self.api_call("/api/users/{}/boards".format(self.user_id))
        return boards_data


class WekanAPIWraper:
    def __init__(self):
        self.wapi = WekanApi(app_config.WEKAN_URL,{'username': app_config.WEKAN_USER, 'password': app_config.WEKAN_PASS})
        boards = self.wapi.get_user_boards()
        for board in boards:
            if app_config.WEKAN_BOARD_TITLE == board['title']:
                self.b_id = board['_id']

        if self.b_id is None:
            print("invalid board name.")
            exit(1)

        lanes = self.wapi.api_call(f'/api/boards/{self.b_id}/swimlanes')
        for lane in lanes:
            if app_config.WEKAN_SWIMLANE_TITLE == lane['title']:
                self.la_id = lane['_id']

        if self.la_id is None:
            print("invalid lane name.")
            exit(2)

        lists = self.wapi.api_call(f'/api/boards/{self.b_id}/lists')
        for xlist in lists:
            if app_config.WEKAN_LIST_TITLE == xlist['title']:
                self.l_id = xlist['_id']

        if self.l_id is None:
            print("invalid list title.")
            exit(3)

    def add_card(self,title, descr):
        return self.wapi.api_call(f'/api/boards/{self.b_id}/lists/{self.l_id}/cards',
                          {'title': title,
                           'description': descr,
                           'authorId': self.wapi.user_id,
                           "swimlaneId": self.la_id})

