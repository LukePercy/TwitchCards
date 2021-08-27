import Bill from './cards/Bill-01.svg';
import Miraqen from './cards/Miraqen_5.svg';
import Baron from './cards/Byrem_2.svg';
import TheDM from './cards/DM_2-01.svg';
import Morely from './cards/Morely_2.svg';
import CardBack from './cards/Card_Back-01.svg';

export const slides = [

    {
    id: 1, //unique id Not yet used - may need for checking if card already exists in users collection
    title: "Miraqen",
    subtitle: "The Druid",
    description: "Adventure is never far away",
    rarity: "Worn",    //Rarity not yet used but we may want to use this to change something or display
    frontimage: Miraqen,
    backimage: CardBack
    },
    {
    id: 2,
    title: 'Baron "The Baron" Byrem',
    subtitle: "Wizard Necromancer",
    description: "Leave no body behind",
    rarity: "Foil",
    frontimage: Baron,
    backimage: CardBack
    },
    {
    id: 3,
    title: "Cptn. Morely",
    subtitle: "Rogue",
    description: "Run away!",
    rarity: "Worn",
    frontimage: Morely,
    backimage: CardBack
    },
    {
    id: 4,
    title: "Bill",
    subtitle: "Bard",
    description: "...and my Lute!",
    rarity: "Mint",
    frontimage: Bill,
    backimage: CardBack
    },
    {
    id: 5,
    title: "The DM",
    subtitle: "The DM",
    description: "It's Get...Getting Dicey!",
    rarity: "Foil",
    frontimage: TheDM,
    backimage: CardBack
    }
]