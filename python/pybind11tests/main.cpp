#include <pybind11/pybind11.h>
#include <pybind11/functional.h>

#include <iostream>
using namespace std;
namespace py = pybind11;

class testClass{
	std::string myName;
	std::function<void(std::string)> callBackFunc;
public:
	testClass(std::string name);
	std::string getName();
	void callPython(std::string param);
	void setCallbackFunc(std::function<void(std::string)> func);

}; 

std::string testClass::getName() {
	cout << "c++ -> getName()..."  << "\n";
	return myName;
}

void testClass::callPython(std::string param){
	if (callBackFunc) {
		cout << "c++ -> calling callBackFunc..." << "\n";
		callBackFunc(param);
	}else {
		cout << "c++ -> no callBackFunc defined."  << "\n";
	}
}
void testClass::setCallbackFunc(std::function<void(std::string)> func){
	cout << "c++ -> adding callback..."  << "\n";
	callBackFunc = func;
	cout << "c++ -> callback added."  << "\n";
}

testClass::testClass(std::string name){
	cout << "c++ -> instaciated class with " << name  << "\n";
	myName = name;
}

PYBIND11_MODULE(testExample, m){
	m.doc() = "What? This is a test.";
	py::class_<testClass>(m,"testClass")
		.def(py::init<std::string &>())
		.def("getName",&testClass::getName)
		.def("setCallbackFunc",&testClass::setCallbackFunc)
		.def("callPython",&testClass::callPython)

		;
}

/*
int add(int i, int j) {
    return i + j;
}

PYBIND11_MODULE(example, m) {
    m.doc() = "pybind11 example plugin"; // optional module docstring

    m.def("add", &add, "A function which adds two numbers");
}*/