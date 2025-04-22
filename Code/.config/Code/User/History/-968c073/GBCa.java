class Parent {
    void display() {
        System.out.println("Parent class...");
    }
}

class Child extends Parent {
    @Override
    void display() {
        System.out.println("Child class...");
    }
}

public class Main {
    public static void main(String[] args) {
        Parent ref;

        ref = new Parent();
        ref.display();
        ref = new Child();
        ref.display();
    }
}
