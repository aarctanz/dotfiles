class Parent {
    void display(int x) {
        System.out.println("Parent class...");
    }
}

class Child extends Parent {
    @Override
    void display(int x) {
        System.out.println("Child class...");
    }
}

public class Main {
    public static void main(String[] args) {
        Parent ref;

        ref = new Parent();
        ref.display(5);
        ref = new Child();
        ref.display(5);
    }
}
