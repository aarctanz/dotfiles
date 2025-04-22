n = int(input())

for i in range(n):
    a,b = (int(x) for x in input().split(" "))

    if( a+b )%3 !=0:
        print("NO")
    elif((a,b)[a<b]>2*(a,b)[a>b]):
        print("NO")
    else:
        print("YESt")