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

        int x = 2;
        String result;
        switch (null) {  
            case 1: result = "One";  
            case 2: result = "Two";  
            case 3: result = "Three";  
            default: result = "Unknown"; 
            case 4: result = "four"; 
        }  
        System.out.println(result);
    }
}
