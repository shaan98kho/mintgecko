1. found issues in market table sort
- when click on same button, undo sorting, so need to return default array
- but now button is being applied to both sort icons, so when click user will never be able to change back to default sorting
- need to fix HTML layout
- fix: 
>> change sort button into two separate buttons, one for asc and one for desc
>> changed handleSort params, added activeDir to track current direction
>> fixed handleSort logic, when current key and dir is same as the newly passed in one, return null sortkey and default direction