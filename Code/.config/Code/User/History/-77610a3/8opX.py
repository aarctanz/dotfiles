n = int(input())

for i in range(n):

    n,m  = [ int(x) for x in input().split(" ")]
    a = [ int(x) for x in input().split(" ")]
    b = [ int(x) for x in input().split(" ")]
    # print(a,b)
    for i in range(1,n):
        # print(b[0]-a[i], b[0]-a[i])
        if(b[0]-a[i-1]>a[i]):
            
            print("NO")
            print(b[0]-a[i],a[i])
            break
    else:
        print("YES")
    
    # print("dfsgd")
