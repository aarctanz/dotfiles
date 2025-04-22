public class M {
    public static void main(String[] args){
        // try {
        //    int x = 1;
        //    System.err.println(x/0.0);
        //    System.exit(0);
        //    System.out.println("Try here");
        // } catch(Exception e){
        //     System.out.println(e);
        // }finally {
        //     System.out.println("Here finally!");
        // }

        // String s = ((Boolean)(0.1+0.2==0.3)).toString();
        // s(s);
        int x = 10;
        x(x);

        https:
        System.out.println("Hello");
    }
    
    public final static void x(int x){
        System.out.println(x);
        System.out.println("x+10="+ x+10);
        goto https;
    }

    public final static void s(String str){
        if (str=="e") {
            System.out.println(((Boolean)(0.1+0.2==0.3)).toString().charAt(2)+2);
        } else if (str.equals("e")) {
            System.out.println(((Boolean)(0.1+0.2==0.3)).toString().charAt(2)+1 + "" + 3 + 4);
        } else {
            s(str.substring(1));
        }
    }
}
