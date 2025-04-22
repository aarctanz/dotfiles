t = int(input())

for i in range(t):
    n, k = tuple(input().split(" "))
    list1 = [int(i) for i in input().split(" ")]
    for i in list1:
        a = i
        b = k - a
        ind = list1.index(b)
        if ind != -1:
            

