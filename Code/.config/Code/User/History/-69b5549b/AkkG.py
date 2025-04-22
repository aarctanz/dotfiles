n = int(input())

for i in range(n):
    a,b = (int(x) for x in input().split(" "))

    if( a+b )%3 !=0:
        print("NO")
    elif((a,b)[a<b]>2*(a,b)[a>b]):
        print("NO")
    elif(a==b and a%3==0):
        print("YES")
    else:
        while(a!=0 and b!=0):
            if( a+b )%3 !=0:
                print("NO")
                break
            if(a%2==0 and b%2==0):
                a/=2
                b/=2
                continue
            if(a%3==0 and b%3==0):
                a/=3
                b/=3
                continue
            if(a>=b):
                a-=2
                b-=1
            else:
                b-=2
                a-=1
        if(a==0 and b==0):
            print("YES")
        else:
            print("NO")