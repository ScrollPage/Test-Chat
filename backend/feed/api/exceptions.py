from rest_framework.exceptions import APIException

class BadRequestError(APIException):
    '''Собственная ошибка 400'''
    status_code = 400
    def __init__(self, detail):
        self.detail = detail
