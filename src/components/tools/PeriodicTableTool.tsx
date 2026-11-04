import React, { useState } from 'react';
import { ToolWrapper } from './ToolWrapper';
import { X, Droplets, Grid } from 'lucide-react';

interface Element {
  num: number;
  symbol: string;
  name: string;
  mass: number;
  category: string;
}

interface ToolProps {
  onClose: () => void;
}

const ALL_118_ELEMENTS: Element[] = [
  { num: 1, symbol: 'H', name: 'Водород', mass: 1.008, category: 'Неметалл' },
  { num: 2, symbol: 'He', name: 'Гелий', mass: 4.0026, category: 'Инертный газ' },
  { num: 3, symbol: 'Li', name: 'Литий', mass: 6.94, category: 'Щелочной металл' },
  { num: 4, symbol: 'Be', name: 'Бериллий', mass: 9.0122, category: 'Щелочноземельный' },
  { num: 5, symbol: 'B', name: 'Бор', mass: 10.81, category: 'Металлоид' },
  { num: 6, symbol: 'C', name: 'Углерод', mass: 12.011, category: 'Неметалл' },
  { num: 7, symbol: 'N', name: 'Азот', mass: 14.007, category: 'Неметалл' },
  { num: 8, symbol: 'O', name: 'Кислород', mass: 15.999, category: 'Неметалл' },
  { num: 9, symbol: 'F', name: 'Фтор', mass: 18.998, category: 'Галоген' },
  { num: 10, symbol: 'Ne', name: 'Неон', mass: 20.18, category: 'Инертный газ' },
  { num: 11, symbol: 'Na', name: 'Натрий', mass: 22.99, category: 'Щелочной металл' },
  { num: 12, symbol: 'Mg', name: 'Магний', mass: 24.305, category: 'Щелочноземельный' },
  { num: 13, symbol: 'Al', name: 'Алюминий', mass: 26.982, category: 'Постпереходный' },
  { num: 14, symbol: 'Si', name: 'Кремний', mass: 28.085, category: 'Металлоид' },
  { num: 15, symbol: 'P', name: 'Фосфор', mass: 30.974, category: 'Неметалл' },
  { num: 16, symbol: 'S', name: 'Сера', mass: 32.06, category: 'Неметалл' },
  { num: 17, symbol: 'Cl', name: 'Хлор', mass: 35.45, category: 'Галоген' },
  { num: 18, symbol: 'Ar', name: 'Аргон', mass: 39.948, category: 'Инертный газ' },
  { num: 19, symbol: 'K', name: 'Калий', mass: 39.098, category: 'Щелочной металл' },
  { num: 20, symbol: 'Ca', name: 'Кальций', mass: 40.078, category: 'Щелочноземельный' },
  { num: 21, symbol: 'Sc', name: 'Скандий', mass: 44.956, category: 'Переходный' },
  { num: 22, symbol: 'Ti', name: 'Титан', mass: 47.867, category: 'Переходный' },
  { num: 23, symbol: 'V', name: 'Ванадий', mass: 50.942, category: 'Переходный' },
  { num: 24, symbol: 'Cr', name: 'Хром', mass: 51.996, category: 'Переходный' },
  { num: 25, symbol: 'Mn', name: 'Марганец', mass: 54.938, category: 'Переходный' },
  { num: 26, symbol: 'Fe', name: 'Железо', mass: 55.845, category: 'Переходный' },
  { num: 27, symbol: 'Co', name: 'Кобальт', mass: 58.933, category: 'Переходный' },
  { num: 28, symbol: 'Ni', name: 'Никель', mass: 58.693, category: 'Переходный' },
  { num: 29, symbol: 'Cu', name: 'Медь', mass: 63.546, category: 'Переходный' },
  { num: 30, symbol: 'Zn', name: 'Цинк', mass: 65.38, category: 'Переходный' },
  { num: 31, symbol: 'Ga', name: 'Галлий', mass: 69.723, category: 'Постпереходный' },
  { num: 32, symbol: 'Ge', name: 'Германий', mass: 72.63, category: 'Металлоид' },
  { num: 33, symbol: 'As', name: 'Мышьяк', mass: 74.922, category: 'Металлоид' },
  { num: 34, symbol: 'Se', name: 'Селен', mass: 78.971, category: 'Неметалл' },
  { num: 35, symbol: 'Br', name: 'Бром', mass: 79.904, category: 'Галоген' },
  { num: 36, symbol: 'Kr', name: 'Криптон', mass: 83.798, category: 'Инертный газ' },
  { num: 37, symbol: 'Rb', name: 'Рубидий', mass: 85.468, category: 'Щелочной металл' },
  { num: 38, symbol: 'Sr', name: 'Стронций', mass: 87.62, category: 'Щелочноземельный' },
  { num: 39, symbol: 'Y', name: 'Иттрий', mass: 88.906, category: 'Переходный' },
  { num: 40, symbol: 'Zr', name: 'Цирконий', mass: 91.224, category: 'Переходный' },
  { num: 41, symbol: 'Nb', name: 'Ниобий', mass: 92.906, category: 'Переходный' },
  { num: 42, symbol: 'Mo', name: 'Молибден', mass: 95.95, category: 'Переходный' },
  { num: 43, symbol: 'Tc', name: 'Технеций', mass: 98, category: 'Переходный' },
  { num: 44, symbol: 'Ru', name: 'Рутений', mass: 101.07, category: 'Переходный' },
  { num: 45, symbol: 'Rh', name: 'Родий', mass: 102.91, category: 'Переходный' },
  { num: 46, symbol: 'Pd', name: 'Палладий', mass: 106.42, category: 'Переходный' },
  { num: 47, symbol: 'Ag', name: 'Серебро', mass: 107.87, category: 'Переходный' },
  { num: 48, symbol: 'Cd', name: 'Кадмий', mass: 112.41, category: 'Переходный' },
  { num: 49, symbol: 'In', name: 'Индий', mass: 114.82, category: 'Постпереходный' },
  { num: 50, symbol: 'Sn', name: 'Олово', mass: 118.71, category: 'Постпереходный' },
  { num: 51, symbol: 'Sb', name: 'Сурьма', mass: 121.76, category: 'Металлоид' },
  { num: 52, symbol: 'Te', name: 'Теллур', mass: 127.6, category: 'Металлоид' },
  { num: 53, symbol: 'I', name: 'Иод', mass: 126.9, category: 'Галоген' },
  { num: 54, symbol: 'Xe', name: 'Ксенон', mass: 131.29, category: 'Инертный газ' },
  { num: 55, symbol: 'Cs', name: 'Цезий', mass: 132.91, category: 'Щелочной металл' },
  { num: 56, symbol: 'Ba', name: 'Барий', mass: 137.33, category: 'Щелочноземельный' },
  { num: 57, symbol: 'La', name: 'Лантан', mass: 138.91, category: 'Лантаноид' },
  { num: 58, symbol: 'Ce', name: 'Церий', mass: 140.12, category: 'Лантаноид' },
  { num: 59, symbol: 'Pr', name: 'Празеодим', mass: 140.91, category: 'Лантаноид' },
  { num: 60, symbol: 'Nd', name: 'Неодим', mass: 144.24, category: 'Лантаноид' },
  { num: 61, symbol: 'Pm', name: 'Прометий', mass: 145, category: 'Лантаноид' },
  { num: 62, symbol: 'Sm', name: 'Самарий', mass: 150.36, category: 'Лантаноид' },
  { num: 63, symbol: 'Eu', name: 'Европий', mass: 151.96, category: 'Лантаноид' },
  { num: 64, symbol: 'Gd', name: 'Гадолиний', mass: 157.25, category: 'Лантаноид' },
  { num: 65, symbol: 'Tb', name: 'Тербий', mass: 158.93, category: 'Лантаноид' },
  { num: 66, symbol: 'Dy', name: 'Диспрозий', mass: 162.5, category: 'Лантаноид' },
  { num: 67, symbol: 'Ho', name: 'Гольмий', mass: 164.93, category: 'Лантаноид' },
  { num: 68, symbol: 'Er', name: 'Эрбий', mass: 167.26, category: 'Лантаноид' },
  { num: 69, symbol: 'Tm', name: 'Тулий', mass: 168.93, category: 'Лантаноид' },
  { num: 70, symbol: 'Yb', name: 'Иттербий', mass: 173.05, category: 'Лантаноид' },
  { num: 71, symbol: 'Lu', name: 'Лютеций', mass: 174.97, category: 'Лантаноид' },
  { num: 72, symbol: 'Hf', name: 'Гафний', mass: 178.49, category: 'Переходный' },
  { num: 73, symbol: 'Ta', name: 'Тантал', mass: 180.95, category: 'Переходный' },
  { num: 74, symbol: 'W', name: 'Вольфрам', mass: 183.84, category: 'Переходный' },
  { num: 75, symbol: 'Re', name: 'Рений', mass: 186.21, category: 'Переходный' },
  { num: 76, symbol: 'Os', name: 'Осмий', mass: 190.23, category: 'Переходный' },
  { num: 77, symbol: 'Ir', name: 'Иридий', mass: 192.22, category: 'Переходный' },
  { num: 78, symbol: 'Pt', name: 'Платина', mass: 195.08, category: 'Переходный' },
  { num: 79, symbol: 'Au', name: 'Золото', mass: 196.97, category: 'Переходный' },
  { num: 80, symbol: 'Hg', name: 'Ртуть', mass: 200.59, category: 'Переходный' },
  { num: 81, symbol: 'Tl', name: 'Таллий', mass: 204.38, category: 'Постпереходный' },
  { num: 82, symbol: 'Pb', name: 'Свинец', mass: 207.2, category: 'Постпереходный' },
  { num: 83, symbol: 'Bi', name: 'Висмут', mass: 208.98, category: 'Постпереходный' },
  { num: 84, symbol: 'Po', name: 'Полоний', mass: 209, category: 'Постпереходный' },
  { num: 85, symbol: 'At', name: 'Астат', mass: 210, category: 'Металлоид' },
  { num: 86, symbol: 'Rn', name: 'Радон', mass: 222, category: 'Инертный газ' },
  { num: 87, symbol: 'Fr', name: 'Франций', mass: 223, category: 'Щелочной металл' },
  { num: 88, symbol: 'Ra', name: 'Радий', mass: 226, category: 'Щелочноземельный' },
  { num: 89, symbol: 'Ac', name: 'Актиний', mass: 227, category: 'Актиноид' },
  { num: 90, symbol: 'Th', name: 'Торий', mass: 232.04, category: 'Актиноид' },
  { num: 91, symbol: 'Pa', name: 'Протактиний', mass: 231.04, category: 'Актиноид' },
  { num: 92, symbol: 'U', name: 'Уран', mass: 238.03, category: 'Актиноид' },
  { num: 93, symbol: 'Np', name: 'Нептуний', mass: 237, category: 'Актиноид' },
  { num: 94, symbol: 'Pu', name: 'Плутоний', mass: 244, category: 'Актиноид' },
  { num: 95, symbol: 'Am', name: 'Америций', mass: 243, category: 'Актиноид' },
  { num: 96, symbol: 'Cm', name: 'Кюрий', mass: 247, category: 'Актиноид' },
  { num: 97, symbol: 'Bk', name: 'Берклий', mass: 247, category: 'Актиноид' },
  { num: 98, symbol: 'Cf', name: 'Калифорний', mass: 251, category: 'Актиноид' },
  { num: 99, symbol: 'Es', name: 'Эйнштейний', mass: 252, category: 'Актиноид' },
  { num: 100, symbol: 'Fm', name: 'Фермий', mass: 257, category: 'Актиноид' },
  { num: 101, symbol: 'Md', name: 'Менделевий', mass: 258, category: 'Актиноид' },
  { num: 102, symbol: 'No', name: 'Нобелий', mass: 259, category: 'Актиноид' },
  { num: 103, symbol: 'Lr', name: 'Лоуренсий', mass: 266, category: 'Актиноид' },
  { num: 104, symbol: 'Rf', name: 'Резерфордий', mass: 267, category: 'Переходный' },
  { num: 105, symbol: 'Db', name: 'Дубний', mass: 268, category: 'Переходный' },
  { num: 106, symbol: 'Sg', name: 'Сиборгий', mass: 269, category: 'Переходный' },
  { num: 107, symbol: 'Bh', name: 'Борий', mass: 270, category: 'Переходный' },
  { num: 108, symbol: 'Hs', name: 'Хассий', mass: 277, category: 'Переходный' },
  { num: 109, symbol: 'Mt', name: 'Мейтнерий', mass: 278, category: 'Переходный' },
  { num: 110, symbol: 'Ds', name: 'Дармштадтий', mass: 281, category: 'Переходный' },
  { num: 111, symbol: 'Rg', name: 'Рентгений', mass: 282, category: 'Переходный' },
  { num: 112, symbol: 'Cn', name: 'Коперниций', mass: 285, category: 'Переходный' },
  { num: 113, symbol: 'Nh', name: 'Нихоний', mass: 286, category: 'Постпереходный' },
  { num: 114, symbol: 'Fl', name: 'Флеровий', mass: 289, category: 'Постпереходный' },
  { num: 115, symbol: 'Mc', name: 'Московий', mass: 290, category: 'Постпереходный' },
  { num: 116, symbol: 'Lv', name: 'Ливерморий', mass: 293, category: 'Постпереходный' },
  { num: 117, symbol: 'Ts', name: 'Теннессин', mass: 294, category: 'Галоген' },
  { num: 118, symbol: 'Og', name: 'Оганесон', mass: 294, category: 'Инертный газ' },
];

// Solubility Table Data
const ANIONS = ['OH⁻', 'NO₃⁻', 'Cl⁻', 'Br⁻', 'I⁻', 'S²⁻', 'SO₃²⁻', 'SO₄²⁻', 'CO₃²⁻', 'SiO₃²⁻', 'PO₄³⁻', 'CH₃COO⁻'];
const CATIONS = [
  'H⁺', 'NH₄⁺', 'K⁺', 'Na⁺', 'Ag⁺', 'Ba²⁺', 'Ca²⁺', 'Mg²⁺', 'Zn²⁺', 'Cu²⁺', 'Hg²⁺', 'Pb²⁺', 'Fe²⁺', 'Fe³⁺', 'Al³⁺'
];

type SolubilityCode = 'Р' | 'М' | 'Н' | 'РК' | '-';

// Matrix of solubility values: [cationIndex][anionIndex]
const SOLUBILITY_MATRIX: Record<string, Record<string, SolubilityCode>> = {
  'H⁺': { 'OH⁻': 'Р', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'Р', 'I⁻': 'Р', 'S²⁻': 'Р', 'SO₃²⁻': 'Р', 'SO₄²⁻': 'Р', 'CO₃²⁻': 'Р', 'SiO₃²⁻': 'Н', 'PO₄³⁻': 'Р', 'CH₃COO⁻': 'Р' },
  'NH₄⁺': { 'OH⁻': 'Р', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'Р', 'I⁻': 'Р', 'S²⁻': 'Р', 'SO₃²⁻': 'Р', 'SO₄²⁻': 'Р', 'CO₃²⁻': 'Р', 'SiO₃²⁻': 'Р', 'PO₄³⁻': 'Р', 'CH₃COO⁻': 'Р' },
  'K⁺': { 'OH⁻': 'Р', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'Р', 'I⁻': 'Р', 'S²⁻': 'Р', 'SO₃²⁻': 'Р', 'SO₄²⁻': 'Р', 'CO₃²⁻': 'Р', 'SiO₃²⁻': 'Р', 'PO₄³⁻': 'Р', 'CH₃COO⁻': 'Р' },
  'Na⁺': { 'OH⁻': 'Р', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'Р', 'I⁻': 'Р', 'S²⁻': 'Р', 'SO₃²⁻': 'Р', 'SO₄²⁻': 'Р', 'CO₃²⁻': 'Р', 'SiO₃²⁻': 'Р', 'PO₄³⁻': 'Р', 'CH₃COO⁻': 'Р' },
  'Ag⁺': { 'OH⁻': '-', 'NO₃⁻': 'Р', 'Cl⁻': 'Н', 'Br⁻': 'Н', 'I⁻': 'Н', 'S²⁻': 'Н', 'SO₃²⁻': 'Н', 'SO₄²⁻': 'М', 'CO₃²⁻': 'Н', 'SiO₃²⁻': 'Н', 'PO₄³⁻': 'Н', 'CH₃COO⁻': 'Р' },
  'Ba²⁺': { 'OH⁻': 'Р', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'Р', 'I⁻': 'Р', 'S²⁻': 'Р', 'SO₃²⁻': 'Н', 'SO₄²⁻': 'Н', 'CO₃²⁻': 'Н', 'SiO₃²⁻': 'Н', 'PO₄³⁻': 'Н', 'CH₃COO⁻': 'Р' },
  'Ca²⁺': { 'OH⁻': 'М', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'Р', 'I⁻': 'Р', 'S²⁻': 'РК', 'SO₃²⁻': 'Н', 'SO₄²⁻': 'М', 'CO₃²⁻': 'Н', 'SiO₃²⁻': 'Н', 'PO₄³⁻': 'Н', 'CH₃COO⁻': 'Р' },
  'Mg²⁺': { 'OH⁻': 'Н', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'Р', 'I⁻': 'Р', 'S²⁻': 'РК', 'SO₃²⁻': 'Р', 'SO₄²⁻': 'Р', 'CO₃²⁻': 'Н', 'SiO₃²⁻': 'Н', 'PO₄³⁻': 'Н', 'CH₃COO⁻': 'Р' },
  'Zn²⁺': { 'OH⁻': 'Н', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'Р', 'I⁻': 'Р', 'S²⁻': 'Н', 'SO₃²⁻': 'Н', 'SO₄²⁻': 'Р', 'CO₃²⁻': 'Н', 'SiO₃²⁻': 'Н', 'PO₄³⁻': 'Н', 'CH₃COO⁻': 'Р' },
  'Cu²⁺': { 'OH⁻': 'Н', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'Р', 'I⁻': '-', 'S²⁻': 'Н', 'SO₃²⁻': '-', 'SO₄²⁻': 'Р', 'CO₃²⁻': '-', 'SiO₃²⁻': 'Н', 'PO₄³⁻': 'Н', 'CH₃COO⁻': 'Р' },
  'Hg²⁺': { 'OH⁻': '-', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'М', 'I⁻': 'Н', 'S²⁻': 'Н', 'SO₃²⁻': '-', 'SO₄²⁻': 'Р', 'CO₃²⁻': '-', 'SiO₃²⁻': '-', 'PO₄³⁻': 'Н', 'CH₃COO⁻': 'Р' },
  'Pb²⁺': { 'OH⁻': 'Н', 'NO₃⁻': 'Р', 'Cl⁻': 'М', 'Br⁻': 'М', 'I⁻': 'Н', 'S²⁻': 'Н', 'SO₃²⁻': 'Н', 'SO₄²⁻': 'Н', 'CO₃²⁻': 'Н', 'SiO₃²⁻': 'Н', 'PO₄³⁻': 'Н', 'CH₃COO⁻': 'Р' },
  'Fe²⁺': { 'OH⁻': 'Н', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'Р', 'I⁻': 'Р', 'S²⁻': 'Н', 'SO₃²⁻': 'Н', 'SO₄²⁻': 'Р', 'CO₃²⁻': 'Н', 'SiO₃²⁻': 'Н', 'PO₄³⁻': 'Н', 'CH₃COO⁻': 'Р' },
  'Fe³⁺': { 'OH⁻': 'Н', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'Р', 'I⁻': '-', 'S²⁻': '-', 'SO₃²⁻': '-', 'SO₄²⁻': 'Р', 'CO₃²⁻': '-', 'SiO₃²⁻': '-', 'PO₄³⁻': 'Н', 'CH₃COO⁻': 'Р' },
  'Al³⁺': { 'OH⁻': 'Н', 'NO₃⁻': 'Р', 'Cl⁻': 'Р', 'Br⁻': 'Р', 'I⁻': 'Р', 'S²⁻': '-', 'SO₃²⁻': '-', 'SO₄²⁻': 'Р', 'CO₃²⁻': '-', 'SiO₃²⁻': 'Н', 'PO₄³⁻': 'Н', 'CH₃COO⁻': 'Р' },
};

const SOLUBILITY_DESCRIPTIONS: Record<SolubilityCode, { label: string; bg: string; text: string; detail: string }> = {
  'Р': { label: 'Растворимо', bg: 'bg-emerald-950 border-emerald-600', text: 'text-emerald-400', detail: 'Вещество хорошо растворяется в воде' },
  'М': { label: 'Малорастворимо', bg: 'bg-amber-950 border-amber-600', text: 'text-amber-400', detail: 'Образует мутный раствор или незначительный осадок' },
  'Н': { label: 'Нерастворимо', bg: 'bg-red-950 border-red-600', text: 'text-red-400', detail: 'Выпадает в нерастворимый осадок' },
  'РК': { label: 'Растворимо в кислотах', bg: 'bg-purple-950 border-purple-600', text: 'text-purple-400', detail: 'Не растворяется в воде, но растворяется в сильных кислотах' },
  '-': { label: 'Разлагается / Не существует', bg: 'bg-slate-900 border-slate-800', text: 'text-slate-500', detail: 'Вещество реагирует с водой или разлагается' },
};

export const PeriodicTableTool: React.FC<ToolProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'mendeleev' | 'solubility'>('mendeleev');
  const [selectedEl, setSelectedEl] = useState<Element | null>(null);
  const [search, setSearch] = useState('');

  // Selected cell for Solubility Detail Modal
  const [selectedSolubility, setSelectedSolubility] = useState<{ cation: string; anion: string; code: SolubilityCode } | null>(null);

  const filteredElements = ALL_118_ELEMENTS.filter(
    (el) =>
      el.name.toLowerCase().includes(search.toLowerCase()) ||
      el.symbol.toLowerCase().includes(search.toLowerCase()) ||
      el.num.toString().includes(search)
  );

  return (
    <ToolWrapper title="Химический справочник" onClose={onClose}>
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full py-2 font-mono">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-3">
          <button
            onClick={() => setActiveTab('mendeleev')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
              activeTab === 'mendeleev'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            Таблица Менделеева
          </button>
          <button
            onClick={() => setActiveTab('solubility')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
              activeTab === 'solubility'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-4 h-4 text-cyan-400" />
            Таблица растворимости
          </button>
        </div>

        {activeTab === 'mendeleev' ? (
          <>
            <div className="mb-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию, символу или номеру..."
                className="w-full bg-slate-900 border border-slate-800 rounded-none px-4 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-none p-4 flex-1 flex flex-col overflow-hidden">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 overflow-y-auto p-1 max-h-[440px]">
                {filteredElements.map((el) => (
                  <button
                    key={el.num}
                    onClick={() => setSelectedEl(el)}
                    className="p-2 bg-slate-950 border border-slate-800 hover:border-cyan-400 rounded-none flex flex-col items-center justify-between transition-colors cursor-pointer font-mono"
                  >
                    <span className="text-[9px] text-slate-500 self-start font-bold">{el.num}</span>
                    <span className="text-lg font-black text-cyan-400 my-0.5">{el.symbol}</span>
                    <span className="text-[8px] text-slate-300 font-bold truncate max-w-full">{el.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Solubility Table View */
          <div className="bg-slate-900 border border-slate-800 rounded-none p-3 flex-1 flex flex-col overflow-hidden space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2.5 border border-slate-800 text-[10px]">
              <span className="font-extrabold text-cyan-400 uppercase">Обозначения:</span>
              <div className="flex flex-wrap gap-2 font-bold">
                <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-700">Р — Растворимо</span>
                <span className="px-1.5 py-0.5 bg-amber-950 text-amber-400 border border-amber-700">М — Малорастворимо</span>
                <span className="px-1.5 py-0.5 bg-red-950 text-red-400 border border-red-700">Н — Нерастворимо</span>
                <span className="px-1.5 py-0.5 bg-purple-950 text-purple-400 border border-purple-700">РК — Раств. в кислотах</span>
                <span className="px-1.5 py-0.5 bg-slate-900 text-slate-500 border border-slate-800">- — Не существует</span>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[420px] border border-slate-800 bg-slate-950">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 sticky top-0 z-10 border-b border-slate-800">
                    <th className="p-2 text-cyan-400 font-extrabold border-r border-slate-800 bg-slate-900 sticky left-0 z-20">
                      Ионы
                    </th>
                    {ANIONS.map((anion) => (
                      <th key={anion} className="p-2 font-black text-amber-300 border-r border-slate-800 min-w-[48px]">
                        {anion}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CATIONS.map((cation) => (
                    <tr key={cation} className="border-b border-slate-800/80 hover:bg-slate-900/50">
                      <td className="p-2 font-black text-cyan-300 border-r border-slate-800 bg-slate-900 sticky left-0 z-10">
                        {cation}
                      </td>
                      {ANIONS.map((anion) => {
                        const code = SOLUBILITY_MATRIX[cation]?.[anion] || '-';
                        const info = SOLUBILITY_DESCRIPTIONS[code];
                        return (
                          <td key={anion} className="p-1 border-r border-slate-800/50">
                            <button
                              onClick={() => setSelectedSolubility({ cation, anion, code })}
                              className={`w-full py-1 text-[11px] font-black border transition-transform active:scale-90 cursor-pointer ${info.bg} ${info.text}`}
                            >
                              {code}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Selected Element Modal */}
        {selectedEl && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-slate-900 border-2 border-cyan-400 rounded-none p-6 text-center shadow-2xl relative">
              <button
                onClick={() => setSelectedEl(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-none bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 bg-slate-950 border-2 border-cyan-400 rounded-none mx-auto mb-4 flex flex-col items-center justify-center font-mono">
                <span className="text-xs text-slate-500 font-bold">{selectedEl.num}</span>
                <span className="text-3xl font-black text-cyan-400">{selectedEl.symbol}</span>
              </div>

              <h3 className="text-2xl font-black text-white mb-1 uppercase">{selectedEl.name}</h3>
              <p className="text-xs font-mono text-cyan-400 mb-4">{selectedEl.category}</p>

              <div className="bg-slate-950 p-3 rounded-none font-mono text-xs text-slate-300 border border-slate-800">
                Атомная масса: <span className="font-bold text-white">{selectedEl.mass} а.е.м.</span>
              </div>
            </div>
          </div>
        )}

        {/* Selected Solubility Detail Modal */}
        {selectedSolubility && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border-2 border-cyan-400 p-5 text-center shadow-2xl relative space-y-4">
              <button
                onClick={() => setSelectedSolubility(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-none bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">
                Растворимость соединений
              </div>

              <div className="flex justify-center items-center gap-2 text-lg font-black bg-slate-950 p-3 border border-slate-800">
                <span className="text-cyan-300">{selectedSolubility.cation}</span>
                <span className="text-slate-500">+</span>
                <span className="text-amber-300">{selectedSolubility.anion}</span>
              </div>

              <div className={`p-3 border rounded-none ${SOLUBILITY_DESCRIPTIONS[selectedSolubility.code].bg}`}>
                <div className={`text-base font-black uppercase ${SOLUBILITY_DESCRIPTIONS[selectedSolubility.code].text}`}>
                  {selectedSolubility.code} — {SOLUBILITY_DESCRIPTIONS[selectedSolubility.code].label}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {SOLUBILITY_DESCRIPTIONS[selectedSolubility.code].detail}
                </p>
              </div>

              <button
                onClick={() => setSelectedSolubility(null)}
                className="w-full py-2 bg-cyan-500 text-slate-950 font-black uppercase rounded-none cursor-pointer text-xs"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  );
};
