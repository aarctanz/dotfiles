n = int(input())

for i in range(n):
    a,b = (int(x) for x in input().split(" "))

    if( a+b )%3 !=0:
        print("NO")
    elif(max(a,b)>2*min(a,b)):
        print("NO")
    else:
        while(a!=0 and b!=0):
            if(a>=b):
                a-=2
                b-=1
            else:
                b-=2
                a-=1
        if()