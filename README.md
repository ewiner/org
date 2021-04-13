# Org

An org chart visualizer.

###### This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Dev Docs

1. Set up a Google sheet data source and record the Google sheet ID, like `1UgY8dBbj-lyVKwTn2ogJsUEtsam4eTMZO-IWL9-zC30`.
1. Start the dev server: `yarn dev` 
1. Visit http://localhost:3000/[sheetId]
1. Push to deploy through Vercel.

### Bugs

* Correct the spacing issues for wide boxes

### Future Features

* Find-as-you-type on the org chart or filter dropdowns
* A 'notes' field per person, displayed in a tooltip/popup (e.g "on maternity leave until June" or "pitching in on the Skystar project")
* New data model (see below) + better security
* Zoom from the center of the viewport instead of the top left
* More usable zoom buttons
* Portrait/landscape layout switcher
* When the Google Sheet can't be parsed, include more information about why
* Animations as you switch views or change filters

### Maybe Future Features

* View changes over time (but you could use new sheets for that, and it's duplicative with 10kft)
* Percentages of allocation (but that never really works anyway)

### Idea for a New Data Model

The Google sheet data source is really easy to dive in and edit, but has drawbacks:
1. Schema changes have to be copy-pasted across each sheet in the workbook.
1. No easy way to promote changes to other sheets.
1. Too easy to make typos or edits that break formatting.
1. Can't make changes directly in the UI.

What we could do instead is a data model where each view consists of:
* A base view
* Bulk data imports
* Some changes

So, the "Current Org" sheet could be:
1. Based on [Blank]
1. "Import from Greenhouse on 2/12/21" (or fake it with a spreadsheet import/edit tool)
1. "Import from Bamboo on 2/12/21" (or fake it with a spreadsheet import/edit tool)
1. Changed xxxx from xxxx to xxx
1. Added xxx with properties xxxxx

And "Proposed New Org" could be:
1. Based on 'Current State'
1. Changed xxxx from xxxx to xxx
1. Added xxx with properties xxxxx

Then if the new org gets approved, you merge it into the Current Org sheet.  It would still be useful to have a spreadsheet-esque bulk edit tool, though.

This could be implemented in any DB, but maybe https://github.com/gristlabs/grist-core or https://github.com/terminusdb/terminusdb would be cool to try.
