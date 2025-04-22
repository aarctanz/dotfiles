public class A {
    static B b = new B();
}

public class B {
    static A a = new A();

    public static void main(String[] args) {
        System.out.println(A.b);
        System.out.println(B.a);
    }
}