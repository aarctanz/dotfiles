#include <bits/stdc++.h>

int main(){
    int x;
    std::cin>>x;

    for(int i=0; i<x;i++){
        std::vector<int> arr;
        for(int i=0;i<4;i++){
            int x;
            std::cin>>x;
            arr.push_back(x);
        }

        int posx = arr[0] + arr[1];
        int posy = arr[2] - arr[1];

        arr.insert(arr.begin()+2, posx);
        int mmx = 0;
        
    }
}