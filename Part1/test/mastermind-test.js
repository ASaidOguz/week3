//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected


const chai = require("chai");
const path = require("path");
const buildPoseidon = require("circomlibjs").buildPoseidon;
const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("MasterMind-Variation (version 1976  Number Mastermind 6 Digits 4 Hole) test", function () {
    this.timeout(100000000);
    
console.log("Codemaker alternatively gives clue of sum of the 4 secret digit inputs") 
    it("Should give true for correct answer", async () => {
        
     
        
        
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();

        const INPUT = {
            "pubGuessA": "1",
            "pubGuessB": "2",
            "pubGuessC": "3",
            "pubGuessD": "4",
            "pubNumHit":"4",
            "pubNumBlow":"0",
            "pubSolnHash":"4776593854489280653299231615369836331154153341366403124590206665088184979118",
        
            "privSolnA":"1",
            "privSolnB":"2",
            "privSolnC":"3",
            "privSolnD":"4",
            "privSalt":"1234134124"
        }

        const witness = await circuit.calculateWitness(INPUT,true);

        let poseidon = await buildPoseidon();
        let F = poseidon.F;
        const h = poseidon(["1234134124","1","2","3","4"]);
        console.log("Solution hash of The Private inputs: ",poseidon.F.toString(h, 10))
        console.log(witness[0]);
        console.log("\n")
        console.log("Hash Output : ",witness[1]);
        console.log("\n");
        console.log("The codemaker may optionally give, as an extra clue, Code's sum of the digits  : ",witness[2]);
        console.log("\n");

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(poseidon.F.toString(h, 10))));
    });
});