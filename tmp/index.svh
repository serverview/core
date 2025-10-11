<!DOCTYPE html>
<html lang="en">
<head>
    <title>SVH Showcase</title>
</head>
<body>

    <h1>Welcome to the SVH Showcase!</h1>
    <p>This page demonstrates the powerful features of Server View HTML (SVH). A server side html enhanced language for building dynamic web applications with the Server View suite.</p>

    <hr>

    <h2>1. Displaying System & Request Information with <code>&lt;system&gt;</code></h2>
    <p>You can easily display server-side information, like the current version of this application or details about the incoming request.</p>
    <p><em>Example:</em></p>
    <code>&lt;p&gt;Running on version: &lt;system get="version"&gt;&lt;/system&gt;&lt;/p&gt;</code>
    <p><em>Output:</em></p>
    <p>Running on version: <system get="version"></system></p>
    <br>
    <code>&lt;p&gt;URL requested: &lt;system get="request.url"&gt;&lt;/system&gt;&lt;/p&gt;</code>
    <p><em>Output:</em></p>
    <p>URL requested: <system get="request.url"></system></p>

    <hr>

    <h2>2. Conditional Rendering with <code>&lt;condition&gt;</code></h2>
    <p>You can show or hide content based on a simple boolean value.</p>
    <p><em>Example:</em></p>
    <code>&lt;condition is="true"&gt;&lt;then&gt;This message is shown because the condition is true.&lt;/then&gt;&lt;/condition&gt;</code>
    <p><em>Output:</em></p>
    <condition is="true"><then>This message is shown because the condition is true.</then></condition>

    <hr>

    <h2>3. Including Local Files with <code>&lt;include&gt;</code></h2>
    <p>You can embed content from other files directly into your page. Here we are including the content of <code>include.svh</code>:</p>
    <p><em>Example:</em></p>
    <code>&lt;include src="include.svh"&gt;&lt;/include&gt;</code>
    <p><em>Output:</em></p>
    <include src="include.svh"></include>

    <hr>

    <h2>4. Fetching Remote Data with <code>&lt;fetch&gt;</code> and <code>&lt;variable&gt;</code></h2>
    <p>You can fetch data from a URL and display it anywhere on your page. Here we fetch <code>example.txt</code> and display its content.</p>
    <p><em>Example:</em></p>
    <code>&lt;fetch href="/example.txt" as="fileContent"&gt;&lt;/fetch&gt;</code><br>
    <code>&lt;p&gt;Fetched content: &lt;variable get="fileContent"&gt;&lt;/variable&gt;&lt;/p&gt;</code>
    <p><em>Output:</em></p>
    <fetch href="/example.txt" as="fileContent"></fetch>
    <p>Fetched content: <variable get="fileContent"></variable></p>

            <hr>
        
            <h2>5. Handling JSON Data</h2>
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
        
            <h2>6. Iterating over Data with <code>&lt;iterate&gt;</code></h2>
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
            
                                <h2>7. Advanced Conditional Rendering with `defined` and `undefined`</h2>
                                <p>You can check if a variable has been defined, which is useful for dynamically rendering content based on fetched data or other server-side logic.</p>                <h3>Checking for a defined variable:</h3>
                <p><em>Example:</em></p>
                <code>&lt;condition is="userData defined"&gt;&lt;then&gt;The variable 'userData' is defined!&lt;/then&gt;&lt;else&gt;The variable 'userData' is not defined.&lt;/else&gt;&lt;/condition&gt;</code>
                <p><em>Output:</em></p>
                <condition is="userData defined"><then>The variable 'userData' is defined!</then><else>The variable 'userData' is not defined.</else></condition>
            
                <h3>Checking for an undefined variable:</h3>
                <p><em>Example:</em></p>
                <code>&lt;condition is="nonExistentVar undefined"&gt;&lt;then&gt;The variable 'nonExistentVar' is not defined, so this message is shown.&lt;/then&gt;&lt;else&gt;This will not appear.&lt;/else&gt;&lt;/condition&gt;</code>
                <p><em>Output:</em></p>
                <condition is="nonExistentVar undefined"><then>The variable 'nonExistentVar' is not defined, so this message is shown.</then><else>This will not appear.</else></condition>
            
                <h3>Checking for a nested property in a JSON object:</h3>
                <p><em>Example:</em></p>
                <code>&lt;condition is="userData.address defined"&gt;&lt;then&gt;The 'userData.address' property exists.&lt;/then&gt;&lt;/condition&gt;</code>
                <p><em>Output:</em></p>
                <condition is="userData.address defined"><then>The 'userData.address' property exists.</then></condition>
        
                        <h3>Checking for a non-existent nested property:</h3>
                        <p><em>Example:</em></p>
                        <code>&lt;condition is="userData.nonexistentProperty undefined"&gt;&lt;then&gt;This message appears because 'userData.nonexistentProperty' is indeed undefined.&lt;/then&gt;&lt;/condition&gt;</code>
                        <p><em>Output:</em></p>
                        <condition is="userData.nonexistentProperty undefined"><then>This message appears because 'userData.nonexistentProperty' is indeed undefined.</then></condition>
                
                        <hr>
                
                        <h2>8. Numeric Comparisons in Conditions</h2>
                        <p>You can perform numeric comparisons in your conditions.</p>
                
                        <h3>Greater Than:</h3>
                        <p><em>Example:</em></p>
                        <code>&lt;condition is="userData.age > 18"&gt;&lt;then&gt;User is older than 18.&lt;/then&gt;&lt;/condition&gt;</code>
                        <p><em>Output:</em></p>
                        <condition is="userData.age > 18"><then>User is older than 18.</then></condition>
                
                        <h3>Less Than or Equal To:</h3>
                        <p><em>Example:</em></p>
                        <code>&lt;condition is="userData.age <= 30"&gt;&lt;then&gt;User is 30 or younger.&lt;/then&gt;&lt;/condition&gt;</code>
                        <p><em>Output:</em></p>
                        <condition is="userData.age <= 30"><then>User is 30 or younger.</then></condition>
                
                                <h3>Equality:</h3>
                
                                <p><em>Example:</em></p>
                
                                <code>&lt;condition is="userData.age == 30"&gt;&lt;then&gt;User is exactly 30.&lt;/then&gt;&lt;else&gt;User is not 30.&lt;/else&gt;&lt;/condition&gt;</code>
                
                                <p><em>Output:</em></p>
                
                                <condition is="userData.age == 30"><then>User is exactly 30.</then><else>User is not 30.</else></condition>
                
                        
                
                                <h3>False Conditions:</h3>
                
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
                
                        
                
                                
                
                        
                
                                        <h2>9. String Comparisons in Conditions</h2>
                
                        
                
                                        <p>You can perform string comparisons in your conditions. Remember to enclose the string in single quotes.</p>
                
                        
                
                                
                
                        
                
                                        <h3>Equality:</h3>
                
                        
                
                                        <p><em>Example:</em></p>
                
                        
                
                                        <code>&lt;condition is="userData.name == 'John Doe'"&gt;&lt;then&gt;User is John Doe.&lt;/then&gt;&lt;/condition&gt;</code>
                
                        
                
                                        <p><em>Output:</em></p>
                
                        
                
                                        <condition is="userData.name == 'John Doe'"><then>User is John Doe.</then></condition>
                
                        
                
                                
                
                        
                
                                        <h3>Inequality:</h3>
                
                        
                
                                        <p><em>Example:</em></p>
                
                        
                
                                        <code>&lt;condition is="userData.name != 'Jane Doe'"&gt;&lt;then&gt;User is not Jane Doe.&lt;/then&gt;&lt;/condition&gt;</code>
                
                        
                
                                        <p><em>Output:</em></p>
                
                        
                
                                        <condition is="userData.name != 'Jane Doe'"><then>User is not Jane Doe.</then></condition>
                
                        
                
                                
                
                        
                
                                        <h3>False Condition:</h3>
                
                        
                
                                        <p><em>Example:</em></p>
                
                        
                
                                        <code>&lt;condition is="userData.name == 'Jane Doe'"&gt;&lt;then&gt;This will not be displayed.&lt;/then&gt;&lt;else&gt;User is not Jane Doe.&lt;/else&gt;&lt;/condition&gt;</code>
                
                        
                
                                        <p><em>Output:</em></p>
                
                        
                
                                        <condition is="userData.name == 'Jane Doe'"><then>This will not be displayed.</then><else>User is not Jane Doe.</else></condition>
                
                        
                
                                    
                
                        
                
                                    </body>        </html>
        