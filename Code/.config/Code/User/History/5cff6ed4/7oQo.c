struct addrinfo
{
    int ai_flags;             // AI_PASSIVE, AI_CANONNAME, etc.
    int ai_family;            // AF_INET, AF_INET6, AF_UNSPEC
    int ai_socktype;          // SOCK_STREAM, SOCK_DGRAM
    int ai_protocol;          // use 0 for "any"
    size_t ai_addrlen;        // size of ai_addr in bytes
    struct sockaddr *ai_addr; // struct sockaddr_in or _in6
    char *ai_canonname;       // full canonical hostname
    struct addrinfo *ai_next; // linked list, next node
};

struct sockaddr
{
    unsigned short sa_family; // address family, AF_xxx
    char sa_data[14];
};

// Internet address (a structure for historical reasons)
struct in_addr
{
    uint32_t s_addr; // that's a 32-bit int (4 bytes)
};

// (IPv4 only--see struct sockaddr_in6 for IPv6)
struct sockaddr_in
{
    short int sin_family;        // Address family, AF_INET
    unsigned short int sin_port; // Port number
    struct in_addr sin_addr;     // Internet address
    unsigned char sin_zero[8];   // Same size as struct sockaddr
};