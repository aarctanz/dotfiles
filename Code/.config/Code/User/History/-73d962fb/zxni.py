import itertools
x = int(input())

# def simulate(order, cards):


for i in range(x):
    n,m= (int(x) for x in input().split(" "))
    cows = [0] * n
    for i in range(n):
        cows[i] = list(set([int(x) for x in input().split(" ")]))
    
    print(cows)
    first = -1
    for i in cows:
        if(i[0]==0):
            first = i
    print(first)
    # if(first[-1]==n-1):
    #     print(-1)
    # sorted(cows,key=lambda x:True )
    d = {}
    ind = 1
    for i in cows:
        d[ind] = i;
        ind+=1
    top = -1
    # print(d)
    sorted_dict = dict(sorted(d.items(), key=lambda item: item[1][0]))
    print(sorted_dict)
    new_dict = {}
    key  = 0
    flag = True
    # for i in range(1,n+1):
    count = len(sorted_dict)
    k = 0
    while count:
        while k != m:
            # print(key)
            if key in sorted_dict:
                if sorted_dict[key][k] >= top:
                    top = sorted_dict[key][k]
                    key += 1;
                # k += 1
                    # break;
                else:
                    flag = False
                    break
        key = 1
        k += 1
        count -= 1
        
    if flag:
        print(sorted_dict.keys())
    else:
        print("Not Working")


