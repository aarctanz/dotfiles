public class A {
    static { x = 5; }
    static int x = 3;
    {x=x*2;}
    public static void main(String[] args) {
        if(x++ < 8) A.main(args);
        System.out.print(x);
    }
}
