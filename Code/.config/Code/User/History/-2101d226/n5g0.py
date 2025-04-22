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
            