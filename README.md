# Generic Exception

## Introduction
    Standardizing the exception payload format where every exception will provide below details:

-	projectName : Project name has to be specified in properties file
-	timastamp : time when error occured
-	code : error code
-	reason : Reason of the error, if client wants to send specifir reason and the resolution
-	message : Error message
-	description : Description about error
-	httpStatusCode : returns http status code specified in messages properties as shown in messages.properties below
-	locale : Country specific error properties
-	exceptionType : It may be validation error, data error or unknown error
-	exceptionCategory : Exception Category may be Database exception, Network exception etc
-	inspectionFields : extra parameter can be passed to build a custom object which can be access while handling exception and       can be used to generate custom messages such as email notification etc.
-	messageBundle : properties file for internationalization 
-	wrappedException : Wrapped exception has the actual error 
-	stackTrace : error stack

### Installing the package
  ```sh
    npm i generic-exception
```

### Usage

    $ const GenericException = require('generic-exception').GenericException;


- Create messages.properties file in the project 

```js
    errorSavingCustomer = {"code": "101", "description": "Error while saving customer {0}", "httpStatusCode":"500"}
    missingCustomerEmail = {"code": "102", "description": "Missing customer email", "httpStatusCode":"400"}
```
- Example
```sh
    function fileProcessor() {
        try {
            var pipeline = s3.getObject({
                Bucket: 'csv-test-bucket-1',
                Key: 'test.csv'
            }).createReadStream()
                .pipe(es.split(/\r|\r>\n/))
                .pipe(es.mapSync(function (line) {
                    //

                })).on('end', function () {
                    // 
                });
        } catch (e) {
            throw new GenericException.Builder('errorSavingCustomer')
                .withSubstitutionArgs('Custom value 1', 'custom value 2', '...etc')
                .withWrappedException(e)
                .withMessage('Specific error meesage')
                .withExceptionCategory('Specify exception category')
                .withReason('Error reason and resolution can be specified')
                .build();
        }
    }
```


