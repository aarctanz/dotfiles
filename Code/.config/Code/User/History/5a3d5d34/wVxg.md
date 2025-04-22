## Program 1
```java
public class FirstProgram {
    public static void main(String[] args) {
        System.out.println("This is my first java class");
    }
}
```

## Program 2
```java
public class CommandLineArgs {
    public static void main(String[] args) {
        for (String arg : args) {
            System.out.println(arg);
        }
    }
}
```

## Program 3
```java
import java.util.*;

public class WordFrequency {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        String[] words = text.split(" ");
        HashMap<String, Integer> map = new HashMap<>();

        for (String word : words) {
            map.put(word, map.getOrDefault(word, 0) + 1);
        }

        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
```

## Program 4
```java
import java.util.Scanner;

public class PrimeNumbers {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        for (int i = 2; i <= n; i++) {
            boolean prime = true;
            for (int j = 2; j <= i / 2; j++) {
                if (i % j == 0) {
                    prime = false;
                    break;
                }
            }
            if (prime) {
                System.out.print(i + " ");
            }
        }
    }
}
```

## Program 5
```java
public class MatrixMultiplication {
    public static void main(String[] args) {
        int[][] a = {{1, 2}, {3, 4}};
        int[][] b = {{2, 0}, {1, 3}};
        int[][] c = new int[2][2];

        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                for (int k = 0; k < 2; k++) {
                    c[i][j] += a[i][k] * b[k][j];
                }
            }
        }

        for (int[] row : c) {
            for (int col : row) {
                System.out.print(col + " ");
            }
            System.out.println();
        }
    }
}
```

## Program 6
```java
public class Fibonacci {
    static int fib(int n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
    }

    static void nonRecursiveFib(int n) {
        int a = 0, b = 1;
        System.out.print(a + " " + b + " ");
        for (int i = 2; i < n; i++) {
            int c = a + b;
            System.out.print(c + " ");
            a = b;
            b = c;
        }
    }

    public static void main(String[] args) {
        int n = 10;
        for (int i = 0; i < n; i++) {
            System.out.print(fib(i) + " ");
        }
        System.out.println();
        nonRecursiveFib(n);
    }
}
```

## Week 2

[...unchanged content from Week 2 and Week 3...]

## Week 4

## Program 1
```java
public class ExceptionDemo {
    public static void main(String[] args) {
        try {
            int[] arr = {1, 2, 3};
            System.out.println(arr[5]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Exception caught: " + e);
        }
    }
}
```

## Program 2
```java
public class FinallyDemo {
    public static void main(String[] args) {
        try {
            int a = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Caught exception: " + e);
        } finally {
            System.out.println("This will always be executed.");
        }
    }
}
```

## Program 3
```java
public class MultipleCatch {
    public static void main(String[] args) {
        try {
            int[] arr = new int[5];
            arr[5] = 30 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Arithmetic Exception: " + e);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Array Index Exception: " + e);
        } catch (Exception e) {
            System.out.println("General Exception: " + e);
        }
    }
}
```

## Program 4
```java
class CustomException extends Exception {
    CustomException(String message) {
        super(message);
    }
}

public class CustomExceptionDemo {
    static void validate(int age) throws CustomException {
        if (age < 18)
            throw new CustomException("Not eligible to vote");
        else
            System.out.println("Eligible to vote");
    }

    public static void main(String[] args) {
        try {
            validate(15);
        } catch (CustomException e) {
            System.out.println("Caught custom exception: " + e.getMessage());
        }
    }
}
```

## Week 5

## Program 1
```java
class Account {
    String name;
    int accNo;
    double balance;

    Account(String name, int accNo, double balance) {
        this.name = name;
        this.accNo = accNo;
        this.balance = balance;
    }

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited: " + amount);
        } else {
            System.out.println("Invalid deposit amount");
        }
    }

    void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrawn: " + amount);
        } else {
            System.out.println("Insufficient balance or invalid amount");
        }
    }

    void displayBalance() {
        System.out.println("Account Holder: " + name);
        System.out.println("Account Number: " + accNo);
        System.out.println("Current Balance: " + balance);
    }
}

class SavingsAccount extends Account {
    double interestRate;

    SavingsAccount(String name, int accNo, double balance, double interestRate) {
        super(name, accNo, balance);
        this.interestRate = interestRate;
    }

    void addInterest() {
        double interest = balance * interestRate / 100;
        balance += interest;
        System.out.println("Interest added: " + interest);
    }
}

public class BankDemo {
    public static void main(String[] args) {
        SavingsAccount sa = new SavingsAccount("Alice", 12345, 1000.0, 5.0);
        sa.displayBalance();
        sa.deposit(500);
        sa.withdraw(200);
        sa.addInterest();
        sa.displayBalance();
    }
}
```

## Program 2
```java
import java.io.FileOutputStream;
import java.io.IOException;

public class FileWrite {
    public static void main(String[] args) {
        try {
            FileOutputStream fos = new FileOutputStream("output.txt");
            String data = "Hello, this is written using FileOutputStream.";
            fos.write(data.getBytes());
            fos.close();
            System.out.println("Data written successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## Program 3
```java
import java.io.FileInputStream;
import java.io.IOException;

public class FileRead {
    public static void main(String[] args) {
        try {
            FileInputStream fis = new FileInputStream("output.txt");
            int ch;
            while ((ch = fis.read()) != -1) {
                System.out.print((char) ch);
            }
            fis.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## Program 4
```java
import java.io.*;

public class BufferedReaderDemo {
    public static void main(String[] args) {
        try {
            BufferedReader reader = new BufferedReader(new FileReader("output.txt"));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## Program 5
```java
import java.io.*;

public class BufferedWriterDemo {
    public static void main(String[] args) {
        try {
            BufferedWriter writer = new BufferedWriter(new FileWriter("buffered_output.txt"));
            writer.write("This is written using BufferedWriter.");
            writer.newLine();
            writer.write("BufferedWriter is efficient for writing text.");
            writer.close();
            System.out.println("File written using BufferedWriter.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
