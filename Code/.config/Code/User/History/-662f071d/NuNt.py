n = int(input())

if (n*(n+1))//2 % 2==1:
    print("NO")
    exit(1)

s1 = []
s2 = []

def divide(s1,s2, start, end):
    flag = 0
    while(start<end):
        if flag:
            s2.append(start)

if(n%2):
    s1.append(1)
    s1.append(2)
    s2.append(3)
