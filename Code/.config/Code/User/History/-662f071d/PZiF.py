n = int(input())

if (n*(n+1))//2 % 2==1:
    print("NO")
    exit(1)

s1 = []
s2 = []

def divide(s1,s2, start, end):
    flag = 0print(s1,s2)
    while(start<end):
        if flag==1:
            s2.append(start)
            s2.append(end)
            start+=1
            end-=1
            flag = 0
        else:
            s1.append(start)
            s1.append(end)
            start+=1
            end-=1
            flag = 1
    return s1,s2

if(n%2):
    s1.append(1)
    s1.append(2)
    s2.append(3)
    divide(s1,s2,4,n)
else:
    divide(s1,s2,1,n)
print("YES")
print(len(s1))
print(s1)
print(len(s2))
print(s2)