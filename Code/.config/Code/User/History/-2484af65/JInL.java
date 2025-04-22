// // Single Motes
// // Static functions
// // String args
// // string indexing
// // arr.length string.length

// public class Main{
//     int x = 5;
//     Main(){
//         x += 5;
//     }

//     public static void main(String[] args) {

//         A s1 = new A();
//         B s2 = new B();
//         // s1.hello();
//         // s2.hello();
//         // A.hello();
//         // B.hello();
//         int a  = 5;
//         int b = 10;

//         int res = new int[] {a,b}[++a>b++?1:0];

//         System.out.println(res);
//     }

//     @Override
//     public String toString() {
//         return "Main []";
//     }

// }

// class A{
//     public  void hello(){
//         System.out.println("Hello");
//     }
// }

// class B extends A {
//     public  void hello(){
//         System.out.println("World");
//     }
// }

// public class Main {
//     static int x = 5;
//     static{
//         int x = 7;
//     }

//     Main() {
//         x *= 13;
//     }
//     {
//         x += 7;
//     }
//     public static void main(String[] args) {
//         Main m = new Main();
//         if (x >= 2130) {
//             System.out.println("Infinite Reccursion, Heap Memory Overflow");
//             return;
//         }
//         Main.main(args);
//         System.out.println(x);
//     }
// }

// public class Main {
//     int x = 5;

//     public Main() {
//         x = 10;
//     }

//     public Main(int x) {
//         this();
//         this.x = x;
//     }

//     public static void main(String[] args) {
//         Main obj1 = new Main();
//         Main obj2 = new Main(20);

//         System.out.println(obj1.x); // Line 1
//         System.out.println(obj2.x); // Line 2
//     }
// }

// public class Main {

//     public static void main(String[] args) {
//         for(int i=0; i<args.length; i++){
//             for(int j =0; j<args[i].length(); j++){
//                 System.out.println(args[i].charAt(j));
//             }
//         }
//     }
// }

// import java.util.Random;

public class Main {

    public static void main(String[] args) {
        System.out.println(1.0 / 0.0);
        System.out.printf("%d\n", (int) Character.MAX_VALUE);
        System.out.println(Integer.MAX_VALUE);
    }
}

// System.out.println(x);