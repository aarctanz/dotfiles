n = int(input())

for i in range(n):

    n,m  = [ int(x) for x in input().split(" ")]
    a = [ int(x) for x in input().split(" ")]
    b = [ int(x) for x in input().split(" ")]

    for i in range(n-1):
        if(a[i]>a[i+1]):
            if i==0:
                low = 0
            else:
                low = a[i] + a[i-1]
            high = a[i] + a[i+1]
            for j in range(m):
                if j>= low and j<= high:
                    a[i] = b[j]-a[i]
                    break
            else:
                print("NO")
                break

    for i in range(n-1):
        if(a[i]>a[i+1]):
            print("NO")
            break
    else:
        print("YES")