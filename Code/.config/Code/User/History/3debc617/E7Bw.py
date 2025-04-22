n = int(input())

for i in range(n):
    s = input()

    for j in range(1, len(s)-1):
        if(s[j] == s[j+1]):
            print(1)
            break
    else:
        print(len(s))