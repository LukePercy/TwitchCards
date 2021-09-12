import Bill from './cards/Bill-s1-worn.svg';
import Miraqen from './cards/Miraqen-s1-worn.svg';
import Baron from './cards/Byrem-s1-worn.svg';
import TheDM from './cards/DM-s1-worn.svg';
import Morely from './cards/Morely-s1-worn.svg';
// change these to dynamic imports later
import BillMint from './cards/Bill-s1-mint.svg';
import MiraqenMint from './cards/Miraqen-s1-mint.svg';
import BaronMint from './cards/Byrem-s1-mint.svg';
import TheDMMint from './cards/DM-s1-mint.svg';
import MorelyMint from './cards/Morely-s1-mint.svg';
import BillFoil from './cards/Bill-s1-foil.svg';
import MiraqenFoil from './cards/Miraqen-s1-foil.svg';
import BaronFoil from './cards/Byrem-s1-foil.svg';
import TheDMFoil from './cards/DM-s1-foil.svg';
import MorelyFoil from './cards/Morely-s1-foil.svg';
import CardBack from './cards/Card_Back-s1.svg';

export const slides = [

    {
    id: 1, 
    title: "Miraqen",
    subtitle: "The Druid",
    description: "Adventure is never far away",
    rarity: "Worn",
    frontimage: Miraqen,
    backimage: CardBack
    },
    {
    id: 2,
    title: 'Byrem',
    subtitle: "Wizard Necromancer",
    description: "Leave no body behind",
    rarity: "Worn",
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
    rarity: "Worn",
    frontimage: Bill,
    backimage: CardBack
    },
    {
    id: 5,
    title: "The DM",
    subtitle: "The DM",
    description: "It's Get...Getting Dicey!",
    rarity: "Worn",
    frontimage: TheDM,
    backimage: CardBack
    }
]