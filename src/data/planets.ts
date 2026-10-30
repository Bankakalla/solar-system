export interface Planet {
    id: string;
    name: string;
    nameRu: string;
    diameter: number;
    distanceFromSun: number;
    orbitalPeriod: number;
    color: string;
    size: number;
    orbitRadius: number;
    description: string;
}

export const planets: Planet[] = [
    {
        id: 'mercury',
        name: 'Mercury',
        nameRu: 'Меркурий',
        diameter: 4879,
        distanceFromSun: 57.9,
        orbitalPeriod: 88,
        color: '#b5b5b5',
        size: 8,
        orbitRadius: 70,
        description: 'Самая маленькая и ближайшая к Солнцу планета.',
    },
    {
        id: 'venus',
        name: 'Venus',
        nameRu: 'Венера',
        diameter: 12104,
        distanceFromSun: 108.2,
        orbitalPeriod: 225,
        color: '#e8cda0',
        size: 14,
        orbitRadius: 110,
        description: 'Самая горячая планета из-за парникового эффекта.',
    },
    {
        id: 'earth',
        name: 'Earth',
        nameRu: 'Земля',
        diameter: 12756,
        distanceFromSun: 149.6,
        orbitalPeriod: 365,
        color: '#4da6ff',
        size: 15,
        orbitRadius: 155,
        description: 'Наш дом! Единственная планета с жизнью.',
    },
    {
        id: 'mars',
        name: 'Mars',
        nameRu: 'Марс',
        diameter: 6792,
        distanceFromSun: 227.9,
        orbitalPeriod: 687,
        color: '#e05a3a',
        size: 11,
        orbitRadius: 200,
        description: 'Красная планета. Имеет самый высокий вулкан — Олимп.',
    },
    {
        id: 'jupiter',
        name: 'Jupiter',
        nameRu: 'Юпитер',
        diameter: 142984,
        distanceFromSun: 778.6,
        orbitalPeriod: 4333,
        color: '#c8a45c',
        size: 32,
        orbitRadius: 270,
        description: 'Самая большая планета. Имеет Большое Красное Пятно.',
    },
    {
        id: 'saturn',
        name: 'Saturn',
        nameRu: 'Сатурн',
        diameter: 120536,
        distanceFromSun: 1433.5,
        orbitalPeriod: 10759,
        color: '#e8d590',
        size: 28,
        orbitRadius: 340,
        description: 'Знаменита своими кольцами из льда и камней.',
    },
    {
        id: 'uranus',
        name: 'Uranus',
        nameRu: 'Уран',
        diameter: 51118,
        distanceFromSun: 2872.5,
        orbitalPeriod: 30687,
        color: '#7de8e8',
        size: 20,
        orbitRadius: 400,
        description: 'Ледяной гигант, вращающийся «на боку».',
    },
    {
        id: 'neptune',
        name: 'Neptune',
        nameRu: 'Нептун',
        diameter: 49528,
        distanceFromSun: 4495.1,
        orbitalPeriod: 60190,
        color: '#4466ff',
        size: 19,
        orbitRadius: 455,
        description: 'Самая далёкая планета. Ветры до 2100 км/ч.',
    },
];