<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rocketbase/rollup-plugin-api-extractor](./rollup-plugin-api-extractor.md) &gt; [mainFunc](./rollup-plugin-api-extractor.mainfunc.md)

## mainFunc() function

The Api Extractor Rollup Plugin.

<b>Signature:</b>

```typescript
declare function mainFunc({ config, override, generatedConfigLocation, cleanup, invokeOptions }?: Partial<Config>): any;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  { config, override, generatedConfigLocation, cleanup, invokeOptions } | <code>Partial&lt;Config&gt;</code> |  |

<b>Returns:</b>

`any`

## Remarks

Generates a temporary configuration file for api-extractor to use, executes it and cleans up the configuration afterward.

