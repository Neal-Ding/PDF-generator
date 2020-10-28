# PDF-generator
Generate PDF with html template. 

## Installation

```
npm i
```
## Test

Request:
```
POST http://localhost:9001/api/pdf/create
```
Param:
```
{
    "templateData": {
        "content": "I'm here, as always."
    },
    "templateId": "test001"
}
```
