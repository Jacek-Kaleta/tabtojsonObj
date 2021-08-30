# tabtojsonobj
Simple utility to convert tabbed trees into JSON object 

## Usage

Your input test.txt file should be in a format like this:

    Root1
    	ArrayElement[]
    		property0 =  0
    	ArrayElement[]
    		property1 = textvalue
    		property2 = textvalue2
    		property3
    			ArrayElement[]
    			ArrayElement[]
    			TabTextElement@
    				SELECT
    					1 X
    				FROM
    					DUAL

The indents must be tab characters, and a child must have one more tab than its parent. 

Your test.txt:

    
    const tj = require("tabtojsonobj");
    const fs = require('fs');


    let text = fs.readFileSync('./test.txt').toString();
    
    let j1 = tj.tabtojsonObj(text);
    console.log(JSON.stringify(j1, undefined, "\t"));

Your test.js:

    $ node test.js
    
Resulting in:

        {
          "Root1": {
            "ArrayElement": [
              {
                "property0": "0"
              },
              {
                "property1": "textvalue",
                "property2": "textvalue2",
                "property3": {
                  "ArrayElement": [
                    {
                      "property": "0"
                    },
                    {
                      "property": "1"
                    }
                  ],
                  "TabTextElement@": "SELECT\r\n\t1 X\r\nFROM\r\nDUAL"
                }
              }
            ]
          }
        }


