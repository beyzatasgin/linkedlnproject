#!/usr/bin/env python
import os
import sys


def main() -> None:
    # Force the correct settings module for this repo even if an environment
    # variable was set globally (e.g. DJANGO_SETTINGS_MODULE=linkedin_clone.settings).
    os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings"
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()


