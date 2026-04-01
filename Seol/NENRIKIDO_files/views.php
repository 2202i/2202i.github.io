if (!self._FC2VIEWS38931944_1)
{
	var _FC2VIEWS38931944_1 =
	{
		id:38931944,
		disp_js:function()
		{
			var current = false;
			if('currentScript' in document && 'parentNode' in document.currentScript && 'tagName' in document.currentScript.parentNode && document.currentScript.parentNode.tagName.toUpperCase() != 'HEAD'){
				current = document.currentScript;
			} else {
				current = false;
			}
			if (!current) {
			document.write('<script type="text/javascript" language="javascript"'
				+ ' src="https://counter1.fc2.com/views_js.php?id=38931944&main=1&lang=0'
				+ '" charset="UTF-8"></'+'script>'
			);
			} else {
			var script = document.createElement('script');
			script.src = "https://counter1.fc2.com/views_js.php?id=38931944&main=1&lang=0";
			script.charset="UTF-8";
			current.parentNode.appendChild(script);
			}
		}
	}
}
_FC2VIEWS38931944_1.disp_js();
