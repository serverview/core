<!DOCTYPE html>
<html lang="en">
<head>
    <title>Server View Showcase</title>
</head>
<body>

    <h1>Welcome to the Server View Showcase!</h1>
    <p>This page demonstrates the powerful features of Server View. A server-side system for building dynamic web applications.</p>

    <hr>
    
    <h2>Server View HTML (SVH)</h2>
    <p>SVH is a templating language that allows you to build dynamic web pages with simple HTML-like tags.</p>

    <hr>

    <h3>1. Displaying System Information with <code>&lt;system&gt;</code></h3>
    <p>The <code>&lt;system&gt;</code> tag is used to display built-in, static server-side information.</p>
    <p><em>Example:</em></p>
    <code>&lt;p&gt;Running on version: &lt;system get="version"&gt;&lt;/system&gt;&lt;/p&gt;</code>
    <p><em>Output:</em></p>
    <p>Running on version: <system get="version"></system></p>
    
    <hr>

    <h3>2. Accessing Request Data with <code>&lt;variable&gt;</code></h3>
    <p>The <code>&lt;variable&gt;</code> tag is used to access all dynamic data, including information from the incoming request.</p>
    <code>&lt;p&gt;URL requested: &lt;variable get="request.url"&gt;&lt;/variable&gt;&lt;/p&gt;</code>
    <p><em>Output:</em></p>
    <p>URL requested: <variable get="request.url"></variable></p>

    <hr>

    <h3>3. Conditional Rendering with <code>&lt;condition&gt;</code></h3>
    <p>You can show or hide content based on a simple boolean value.</p>
    <p><em>Example:</em></p>
    <code>&lt;condition is="true"&gt;&lt;then&gt;This message is shown because the condition is true.&lt;/then&gt;&lt;/condition&gt;</code>
    <p><em>Output:</em></p>
    <condition is="true"><then>This message is shown because the condition is true.</then></condition>

    <hr>

    <h3>4. Including Local Files with <code>&lt;include&gt;</code></h3>
    <p>You can embed content from other files directly into your page. Here we are including the content of <code>include.svh</code>:</p>
    <p><em>Example:</em></p>
    <code>&lt;include src="include.svh"&gt;&lt;/include&gt;</code>
    <p><em>Output:</em></p>
    <include src="include.svh"></include>

    <hr>

    <h3>5. Fetching and Displaying Variables with <code>&lt;fetch&gt;</code> and <code>&lt;variable&gt;</code></h3>
    <p>You can fetch data from a URL and store it in a user-defined variable with the <code>&lt;fetch&gt;</code> tag. You can then display the content of these variables using the <code>&lt;variable&gt;</code> tag.</p>
    <p><em>Example:</em></p>
    <code>&lt;fetch href="/example.txt" as="fileContent"&gt;&lt;/fetch&gt;</code><br>
    <code>&lt;p&gt;Fetched content: &lt;variable get="fileContent"&gt;&lt;/variable&gt;&lt;/p&gt;</code>
    <p><em>Output:</em></p>
    <fetch href="/example.txt" as="fileContent"></fetch>
    <p>Fetched content: <variable get="fileContent"></variable></p>

            <hr>

            <h3>6. Handling JSON Data</h3>
            <p>You can fetch JSON data and access its properties using dot notation.</p>
            <p><em>Example:</em></p>
            <code>&lt;fetch href="/user.json" as="userData"&gt;&lt;/fetch&gt;</code><br>
            <code>&lt;p&gt;User's Name: &lt;variable get="userData.name"&gt;&lt;/variable&gt;&lt;/p&gt;</code><br>
            <code>&lt;p&gt;User's Age: &lt;variable get="userData.age"&gt;&lt;/variable&gt;&lt;/p&gt;</code><br>
            <code>&lt;p&gt;User's City: &lt;variable get="userData.address.city"&gt;&lt;/variable&gt;&lt;/p&gt;</code>
            <p><em>Output:</em></p>
            <fetch href="/user.json" as="userData"></fetch>
            <p>User's Name: <variable get="userData.name"></variable></p>
            <p>User's Age: <variable get="userData.age"></variable></p>
            <p>User's City: <variable get="userData.address.city"></variable></p>
        
            <hr>

            <h3>7. Iterating over Data with <code>&lt;iterate&gt;</code></h3>
            <p>You can loop over arrays in your data and render content for each item.</p>
            <p><em>Example:</em></p>
            <code>
            <pre>
            &lt;table border="1"&gt;
              &lt;thead&gt;
                &lt;tr&gt;
                  &lt;th&gt;Course Title&lt;/th&gt;
                  &lt;th&gt;Credits&lt;/th&gt;
                &lt;/tr&gt;
              &lt;/thead&gt;
              &lt;tbody&gt;
                &lt;iterate over="userData.courses" as="course"&gt;
                  &lt;tr&gt;
                    &lt;td&gt;&lt;variable get="course.title" /&gt;&lt;/td&gt;
                    &lt;td&gt;&lt;variable get="course.credits" /&gt;&lt;/td&gt;
                  &lt;/tr&gt;
                &lt;/iterate&gt;
              &lt;/tbody&gt;
            &lt;/table&gt;
            </pre>
            </code>
            <p><em>Output:</em></p>
            <table border="1">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Credits</th>
                </tr>
              </thead>
              <tbody>
                <iterate over="userData.courses" as="course">
                  <tr>
                    <td><variable get="course.title" /></td>
                    <td><variable get="course.credits" /></td>
                  </tr>
                </iterate>
              </tbody>
                </table>
            
                <hr>

                                <h3>8. Advanced Conditional Rendering with `defined` and `undefined`</h3>
                                <p>You can check if a variable has been defined, which is useful for dynamically rendering content based on fetched data or other server-side logic.</p>
                <h4>Checking for a defined variable:</h4>
                <p><em>Example:</em></p>
                <code>&lt;condition is="userData defined"&gt;&lt;then&gt;The variable 'userData' is defined!&lt;/then&gt;&lt;else&gt;The variable 'userData' is not defined.&lt;/else&gt;&lt;/condition&gt;</code>
                <p><em>Output:</em></p>
                <condition is="userData defined"><then>The variable 'userData' is defined!</then><else>The variable 'userData' is not defined.</else></condition>
            
                <h4>Checking for an undefined variable:</h4>
                <p><em>Example:</em></p>
                <code>&lt;condition is="nonExistentVar undefined"&gt;&lt;then&gt;The variable 'nonExistentVar' is not defined, so this message is shown.&lt;/then&gt;&lt;else&gt;This will not appear.&lt;/else&gt;&lt;/condition&gt;</code>
                <p><em>Output:</em></p>
                <condition is="nonExistentVar undefined"><then>The variable 'nonExistentVar' is not defined, so this message is shown.</then><else>This will not appear.</else></condition>
            
                <h4>Checking for a nested property in a JSON object:</h4>
                <p><em>Example:</em></p>
                <code>&lt;condition is="userData.address defined"&gt;&lt;then&gt;The 'userData.address' property exists.&lt;/then&gt;&lt;/condition&gt;</code>
                <p><em>Output:</em></p>
                <condition is="userData.address defined"><then>The 'userData.address' property exists.</then></condition>
        
                        <h4>Checking for a non-existent nested property:</h4>
                        <p><em>Example:</em></p>
                        <code>&lt;condition is="userData.nonexistentProperty undefined"&gt;&lt;then&gt;This message appears because 'userData.nonexistentProperty' is indeed undefined.&lt;/then&gt;&lt;/condition&gt;</code>
                        <p><em>Output:</em></p>
                        <condition is="userData.nonexistentProperty undefined"><then>This message appears because 'userData.nonexistentProperty' is indeed undefined.</then></condition>
                
                        <hr>
                
                        <h3>9. Numeric Comparisons in Conditions</h3>
                        <p>You can perform numeric comparisons in your conditions.</p>
                
                        <h4>Greater Than:</h4>
                        <p><em>Example:</em></p>
                        <code>&lt;condition is="userData.age > 18"&gt;&lt;then&gt;User is older than 18.&lt;/then&gt;&lt;/condition&gt;</code>
                        <p><em>Output:</em></p>
                        <condition is="userData.age > 18"><then>User is older than 18.</then></condition>
                
                        <h4>Less Than or Equal To:</h4>
                        <p><em>Example:</em></p>
                        <code>&lt;condition is="userData.age <= 30"&gt;&lt;then&gt;User is 30 or younger.&lt;/then&gt;&lt;/condition&gt;</code>
                        <p><em>Output:</em></p>
                        <condition is="userData.age <= 30"><then>User is 30 or younger.</then></condition>
                
                                <h4>Equality:</h4>
                
                                <p><em>Example:</em></p>
                
                                <code>&lt;condition is="userData.age == 30"&gt;&lt;then&gt;User is exactly 30.&lt;/then&gt;&lt;else&gt;User is not 30.&lt;/else&gt;&lt;/condition&gt;</code>
                
                                <p><em>Output:</em></p>
                
                                <condition is="userData.age == 30"><then>User is exactly 30.</then><else>User is not 30.</else></condition>
                
                        
                
                                <h4>False Conditions:</h4>
                
                                <p><em>Example (userData.age > 40):</em></p>
                
                                <code>&lt;condition is="userData.age > 40"&gt;&lt;then&gt;This will not be displayed.&lt;/then&gt;&lt;else&gt;userData.age is not > 40.&lt;/else&gt;&lt;/condition&gt;</code>
                
                                <p><em>Output:</em></p>
                
                                <condition is="userData.age > 40"><then>This will not be displayed.</then><else>userData.age is not > 40.</else></condition>
                
                        
                
                                <p><em>Example (userData.age < 20):</em></p>
                
                                <code>&lt;condition is="userData.age < 20"&gt;&lt;then&gt;This will not be displayed.&lt;/then&gt;&lt;else&gt;userData.age is not < 20.&lt;/else&gt;&lt;/condition&gt;</code>
                
                                <p><em>Output:</em></p>
                
                                <condition is="userData.age < 20"><then>This will not be displayed.</then><else>userData.age is not < 20.</else></condition>
                
                        
                
                                        <p><em>Example (userData.age != 30):</em></p>
                
                        
                
                                        <code>&lt;condition is="userData.age != 30"&gt;&lt;then&gt;This will not be displayed.&lt;/then&gt;&lt;else&gt;userData.age is 30.&lt;/else&gt;&lt;/condition&gt;</code>
                
                        
                
                                        <p><em>Output:</em></p>
                
                        
                
                                        <condition is="userData.age != 30"><then>This will not be displayed.</then><else>userData.age is 30.</else></condition>
                
                        
                
                                
                
                        
                
                                        <hr>
                
                        
                
                                
                
                        
                
                                        <h3>10. String Comparisons in Conditions</h3>
                
                        
                
                                        <p>You can perform string comparisons in your conditions. Remember to enclose the string in single quotes.</p>
                
                        
                
                                
                
                        
                
                                        <h4>Equality:</h4>
                
                        
                
                                        <p><em>Example:</em></p>
                
                        
                
                                        <code>&lt;condition is="userData.name == 'John Doe'"&gt;&lt;then&gt;User is John Doe.&lt;/then&gt;&lt;/condition&gt;</code>
                
                        
                
                                        <p><em>Output:</em></p>
                
                        
                
                                        <condition is="userData.name == 'John Doe'"><then>User is John Doe.</then></condition>
                
                        
                
                                
                
                        
                
                                        <h4>Inequality:</h4>
                
                        
                
                                        <p><em>Example:</em></p>
                
                        
                
                                        <code>&lt;condition is="userData.name != 'Jane Doe'"&gt;&lt;then&gt;User is not Jane Doe.&lt;/then&gt;&lt;/condition&gt;</code>
                
                        
                
                                        <p><em>Output:</em></p>
                
                        
                
                                        <condition is="userData.name != 'Jane Doe'"><then>User is not Jane Doe.</then></condition>
                
                        
                
                                
                
                        
                
                                        <h4>False Condition:</h4>
                
                        
                
                                                <p><em>Example:</em></p>
                
                        
                
                                                <code>&lt;condition is="userData.name == 'Jane Doe'"&gt;&lt;then&gt;This will not be displayed.&lt;/then&gt;&lt;else&gt;User is not Jane Doe.&lt;/else&gt;&lt;/condition&gt;</code>
                
                        
                
                                                <p><em>Output:</em></p>
                
                        
                
                                                <condition is="userData.name == 'Jane Doe'"><then>This will not be displayed.</then><else>User is not Jane Doe.</else></condition>
                
                        
                
                                        
                
                        
                
                                                <hr>
                
                        
                
                                        
                
                        
                
                                                <h3>11. Contains Operator in Conditions</h3>
                
                        
                
                                                <p>You can check if a string contains a substring or if an array contains a specific value.</p>
                
                        
                
                                        
                
                        
                
                                                <h4>String Contains:</h4>
                
                        
                
                                                <p><em>Example:</em></p>
                
                        
                
                                                <code>&lt;condition is="userData.name contains 'Doe'"&gt;&lt;then&gt;User's name contains 'Doe'.&lt;/then&gt;&lt;/condition&gt;</code>
                
                        
                
                                                <p><em>Output:</em></p>
                
                        
                
                                                <condition is="userData.name contains 'Doe'"><then>User's name contains 'Doe'.</then></condition>
                
                        
                
                                        
                
                        
                
                                                        <h4>Array Contains:</h4>
                
                        
                
                                        
                
                        
                
                                                        <p><em>Example:</em></p>
                
                        
                
                                        
                
                        
                
                                                        <code>&lt;condition is="userData.courses.title contains 'Math'"&gt;&lt;then&gt;User is enrolled in Math.&lt;/then&gt;&lt;/condition&gt;</code>
                
                        
                
                                        
                
                        
                
                                                        <p><em>Output:</em></p>
                
                        
                
                                        
                
                        
                
                                                        <condition is="userData.courses.title contains 'Math'"><then>User is enrolled in Math.</then></condition>
                
                        
                
                                        
                
                        
                
                                                <h4>False Condition:</h4>
                
                        
                
                                                <p><em>Example:</em></p>
                
                        
                
                                                <code>&lt;condition is="userData.name contains 'Smith'"&gt;&lt;then&gt;This will not be displayed.&lt;/then&gt;&lt;else&gt;User's name does not contain 'Smith'.&lt;/else&gt;&lt;/condition&gt;</code>
                
                        
                
                                                <p><em>Output:</em></p>
                
                        
                
                                                <condition is="userData.name contains 'Smith'"><then>This will not be displayed.</then><else>User's name does not contain 'Smith'.</else></condition>
                
                        
                
                                            
                
                        
                
                                            </body>        </html>
        