<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello from SVH</title>
</head>
<body>
    <p>Hi from SVH on version <system get="version"></system>.</p>
    <condition is="true" container="div">
        <then>
            This text shows because the outer condition is true.
            <condition is="true">
                <then container="p">This is a nested condition in a paragraph.</then>
                <else><p>This should not show.</p></else>
            </condition>
        </then>
        <else>This text would show if the condition were false.</else>
    </condition>
    <br>
    <condition is="true" container="span">
        <then>This text is in a span.</then>
        <else>This text will not be shown.</else>
    </condition>
</body>
</html>