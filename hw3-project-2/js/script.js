    /**
     * Loads in the table information from fifa-matches.json

d3.json('data/fifa-matches.json',function(error,data){

    /**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *

    d3.csv("data/fifa-tree.csv", function (error, csvData) {

        //Create a unique "id" field for each game
        csvData.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        window.tree = tree;
        tree.createTree(csvData);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(data,tree);
        window.table = table;
        table.createTable();
        table.updateTable();
    });
});
*/


// // // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

    /**
    * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
    *
    */
    window.matchesCSV = matchesCSV;
    d3.csv("data/fifa-tree.csv", function (error, treeCSV) {
        let matchesCSV = window.matchesCSV;
        delete window.matchesCSV;

       let mapVal = (result) => {
           switch(result) {
               case 'Winner': return 7;
               case 'Runner-Up': return 6;
               case 'Third Place': return 5;
               case 'Fourth Place': return 4;
               case 'Semi Finals': return 3;
               case 'Quarter Finals': return 2;
               case 'Round of Sixteen': return 1;
               case 'Group': return 0;
           }
       }


       let data = d3.nest()
           .key(function (d) {
               return d.Team;
           })
           .rollup(function (games) {
               let resultRanking = d3.max(games, d => mapVal(d['Result']));
               let resultLabel = "";

               switch(resultRanking) {
                   case 7: resultLabel = 'Winner';
                   case 6: resultLabel = 'Runner-Up';
                   case 5: resultLabel = 'Third Place';
                   case 4: resultLabel = 'Fourth Place';
                   case 3: resultLabel = 'Semi Finals';
                   case 2: resultLabel = 'Quarter Finals';
                   case 1: resultLabel = 'Round of Sixteen';
                   case 0: resultLabel = 'Group';
               }

               return {
                   "Goals Made": d3.sum(games, d => d['Goals Made']),
                   "Goals Conceded": d3.sum(games, d => d['Goals Conceded']),
                   "Delta Goals": d3.sum(games, d => d['Delta Goals']),
                   "Wins": d3.sum(games, d => d.Wins),
                   "Losses": d3.sum(games, d => d.Losses),
                   "Result": {"label": resultLabel, "ranking": resultRanking},
                   "TotalGames": games.length,
                   "type": "aggregate",
                   "games": games.map(d => new Object({
                       "key": d.Opponent,
                       "value": {
                           "Goals Made": d['Goals Made'],
                           "Goals Conceded": d['Goals Conceded'],
                           "Delta Goals": [],
                           "Wins": [],
                           "Losses": [],
                           "Result": {"label": d.Result, "ranking": mapVal(d['Result'])},
                           "type": "game",
                           "Opponent": d.Team
                           }
                       })
                   )
               }
           })
           .entries(matchesCSV);

           treeCSV.forEach(function (d, i) {
               d.id = d.Team + d.Opponent + i;
           });

           //Create Tree Object
           let tree = new Tree();
           window.tree = tree;
           tree.createTree(treeCSV);

           //Create Table Object and pass in reference to tree object (for hover linking)
           let table = new Table(data,tree);
           window.table = table;
           table.createTable();
           table.updateTable();

    });

});
// // ********************** END HACKER VERSION ***************************
