class Parent {
    void display(String x) {
        System.out.println("From Parent class... " + x);
    }
}

class Child extends Parent {
    void display(Object x) {
        System.out.println("From Child class... " + x);
    }
}

public class Main {
    public static void main(String[] args) {
        Parent ref;

        ref = new Parent();
        ref.display("Hi");
        ref = new Child();
        ref.display("Hi");
    }
}
