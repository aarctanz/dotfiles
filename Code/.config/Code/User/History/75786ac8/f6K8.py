t = int(input())

for i in range(t):
    n, k = tuple(int(i) for i in input().split(" "))
    list1 = [int(i) for i in input().split(" ")]
    score = 0
    for i in list1:
        a = i
        b = k - a
        try:
            ind = list1.index(b)
            score += 1
            list1.remove(a)
            list1.remove(b)
        except Exception:
            continue
    
            
    print(score)        


