const toys = [
    {
        id: 1,
        name: "Mini Racing car",
        image: "https://m.media-amazon.com/images/I/71vhzTarLDL._AC_UF1000,1000_QL80_.jpg",
        price: 499,
        category: "car",
        age: "3-5",
        rating: 4.5,
        stock: 8
    },
    {
        id: 2,
        name: "Turbo Speed Car",
        image: "https://m.media-amazon.com/images/I/71M1NLIQn-L._AC_UF1000,1000_QL80_.jpg",
        category: "car",
        price: 399,
        rating: 4.2,
        age: "4-8",
        stock: 5
    },
    {
        id: 3,
        image: "https://m.media-amazon.com/images/I/614XZk9vBiL._AC_UF1000,1000_QL80_.jpg",
        name: "Electric Flash Car",
        category: "car",
        price: 549,
        rating: 4.7,
        age: "6-10",
        stock: 12
    },
    {
        id: 4,
        image: "https://htcstore.in/wp-content/uploads/2024/05/Untitled-design-2024-05-30T161203.305.png",
        name: "Pull Back Racer",
        category: "car",
        price: 199,
        rating: 4.1,
        age: "3-7",
        stock: 15
    },
    {
        id: 5,
        image: "https://www.jiomart.com/images/product/original/rvlddvif6c/humaira-monster-truck-offroad-car-toy-push-and-go-friction-powered-4-wheel-drive-pack-of-2-product-images-orvlddvif6c-p597509306-0-202301120518.jpg?im=Resize=(420,420)",
        name: "Off-Road Monster Truck",
        category: "car",
        price: 699,
        rating: 4.8,
        age: "6-12",
        stock: 5
    },
    {
        id: 6,
        image: "https://m.media-amazon.com/images/I/71GmKVRJd-L.jpg",
        name: "Cuddly Teddy Bear",
        category: "soft",
        price: 499,
        rating: 4.6,
        age: "0-2",
        stock: 0
    },
    {
        id: 7,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-YvqmDI7IAFHkVHjIVTlZL6DX_U50gU6yYg&s",
        name: "Fluffy Bunny Plush",
        category: "soft",
        price: 349,
        rating: 4.3,
        age: "0-4",
        stock: 10
    },
    {
        id: 8,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmNuEG53gKuou6Mgbdrw-x2GtiJ-xXOWYrOQ&s",
        name: "Cute Panda Plush",
        category: "soft",
        price: 399,
        rating: 4.7,
        age: "1-6",
        stock: 6
    },
    {
        id: 9,
        image: "https://media.istockphoto.com/id/1371667612/photo/cute-unicorn-isolated-on-white-background-plush-toys-for-kids-pink-colors.jpg?s=612x612&w=0&k=20&c=w1nEjiStj2y5HjfklGvdIKhADkdRWpb5p3gCVkkWuf4=",
        name: "Mini Unicorn Plush",
        category: "soft",
        price: 299,
        rating: 4.4,
        age: "0-7",
        stock: 9
    },
    {
        id: 10,
        image: "https://murukali.com/cdn/shop/files/Giant-Teddy-Bear-card-murukali-com-2037_600x700.jpg?v=1744979246",
        name: "Giant Teddy Buddy",
        category: "soft",
        price: 999,
        rating: 4.9,
        age: "2-10",
        stock: 3
    },
    {
        id: 11,
        image: "https://craftdeals.in/wp-content/uploads/2024/06/61D9QeK10WL._AC_SL1500_.jpg",
        name: "Wooden Shape Puzzle",
        category: "puzzle",
        price: 249,
        rating: 4.2,
        age: "2-5",
        stock: 14
    },
    {
        id: 12,
        image: "https://rukminim2.flixcart.com/image/480/640/xif0q/puzzle/e/6/y/35-wild-safari-animal-puzzle-premium-wooden-jigsaw-puzzles-for-original-imah69f7d5sypept.jpeg?q=90",
        name: "Animal Jigsaw Puzzle",
        category: "puzzle",
        price: 199,
        rating: 4.3,
        age: "3-6",
        stock: 11
    },
    {
        id: 13,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsboKluux8Qlh0EvLqnC_2oEWcQZ3nlkibTA&s",
        name: "Brain Teaser Cube",
        category: "puzzle",
        price: 399,
        rating: 4.6,
        age: "6-12",
        stock: 7
    },
    {
        id: 14,
        image: "https://m.media-amazon.com/images/I/910li7k10pL.jpg",
        name: "Map of India Puzzle",
        category: "puzzle",
        price: 299,
        rating: 4.4,
        age: "5-10",
        stock: 0
    },
    {
        id: 15,
        image: "https://m.media-amazon.com/images/I/61zRUy7BSPL.jpg",
        name: "Number Learning Puzzle",
        category: "puzzle",
        price: 249,
        rating: 4.1,
        age: "3-7",
        stock: 13
    },
    {
        id: 16,
        image: "https://m.media-amazon.com/images/I/81b+StNWnBL._AC_UF1000,1000_QL80_.jpg",
        name: "Alphabet Learning Board",
        category: "learning",
        price: 349,
        rating: 4.5,
        age: "2-6",
        stock: 10
    },
    {
        id: 17,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt2c31jvJZZRFuA86wKt5cPy0x7vCPRIlWNw&s",
        name: "Build & Learn Blocks",
        category: "learning",
        price: 499,
        rating: 4.7,
        age: "3-7",
        stock: 6
    },
    {
        id: 18,
        image: "https://m.media-amazon.com/images/I/716Ll6jmGTL.jpg",
        name: "Math Counting Set",
        category: "learning",
        price: 299,
        rating: 4.3,
        age: "3-6",
        stock: 9
    },
    {
        id: 19,
        image: "https://m.media-amazon.com/images/I/812m-WKmHTL._AC_UF1000,1000_QL80_.jpg",
        name: "Electronic Learning Pad",
        category: "learning",
        price: 899,
        rating: 4.9,
        age: "4-10",
        stock: 4
    },
    {
        id: 20,
        image: "https://m.media-amazon.com/images/I/71jLkT+qfSL.jpg",
        name: "Solar System Model Kit",
        category: "learning",
        price: 649,
        rating: 4.8,
        age: "6-12",
        stock: 5
    },
    {
        id: 21,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrKcTZ_DrpKTHglZQywzdLDGZD6NMPTQYyPw&s",
        name: "Pretty Princess Doll",
        category: "doll",
        price: 449,
        rating: 4.5,
        age: "3-8",
        stock: 8
    },
    {
        id: 22,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSb1YJoxuLyRw-9BCSIvXuHSf6jq7rhsW36g&s",
        name: "Labubu Style Figure",
        category: "doll",
        price: 999,
        rating: 4.8,
        age: "6+",
        stock: 0
    },
    {
        id: 23,
        image: "https://m.media-amazon.com/images/I/81SU+E6kf4L.jpg",
        name: "Mini Baby Doll Set",
        category: "doll",
        price: 399,
        rating: 4.2,
        age: "3-7",
        stock: 12
    },
    {
        id: 24,
        image: "https://m.media-amazon.com/images/I/61iE4oxcCOL._AC_UF1000,1000_QL80_.jpg",
        name: "Fairy Glow Doll",
        category: "doll",
        price: 549,
        rating: 4.6,
        age: "4-9",
        stock: 6
    },
    {
        id: 25,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH5mYAgtizikFLBNPeYQw3bGY9B03RQkY2WA&s",
        name: "Barbie Style Fashion Doll",
        category: "doll",
        price: 799,
        rating: 4.7,
        age: "4-12",
        stock: 5
    }
];