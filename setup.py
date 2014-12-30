# -*- coding: utf-8 -*-
from setuptools import setup
import sys

if sys.platform == "win32":
    # python setup.py py2exe
    import py2exe
    platform_options = {
        "windows": [{
            "script": "server.py",
            "icon_resources": [(1, "window_icon.ico")],
            "dest_base": "dodo"
        }],
        "zipfile": None,
        "setup_requires": ["py2exe"],
        "options": {
            "py2exe": {
                "includes": 	["flask.Flask",
				"flask.request",
				"flask.make_response"],
                "dll_excludes": ["w9xpopen.exe",
                                 "msvcr71.dll",
                                 "MSVCP90.dll"],
                "compressed": True
            }
        }
    }
elif sys.platform == "darwin":
    # python setup.py py2app
    platform_options = {
        "setup_requires": ["py2app"],
        "app": ["server.py"],
        "options": {
            "py2app": {
                "argv_emulation": True,
                "includes": 	["flask.Flask",
				"flask.request",
				"flask.make_response"],
                "iconfile": "icon.icns"
            }
        }
    }
else:
    # python setup.py install
    platform_options = {
        "scripts": ["server.py"]
    }
    
setup(name="udownloader",
      description="UNIST portal downloader",
      version="0.0.1",
      **platform_options)
