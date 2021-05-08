import testExample
u = testExample.testClass('a')

def a(b):
	print("python -> Callback called from c++: "+b)


print("python -> call unregistered callback...")
u.callPython("fuck you from python")
print("python -> register callback...")
u.setCallbackFunc(a)

u.callPython("fuck you from python")