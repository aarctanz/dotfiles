t = int(input())

for i in range(t):
    n, k = tuple(input().split(" "))
    list1 = [int(i) for i in input().split(" ")]
    score = 0
    for i in list1:
        a = i
        b = k - a
        ind = list1.index(b)
        if ind != -1:
            score += 1
            list1.remove(a)
            list1.remove(b)
            


