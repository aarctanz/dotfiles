public class Parent {
    public void method(Object o) {
        System.out.println("Parent: Object");
    }
}

public class Child extends Parent {
    public void method(String s) {
        System.out.println("Child: String");
    }

    public static void main(String[] args) {
        Parent obj = new Child();
        obj.method(null); // Line 1
    }
}