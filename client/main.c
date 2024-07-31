#include <stdio.h>
#include <string.h>

void usage();
void parse_json(char *toml_path);
void get_item(char *item);
void set_item(char *item, char *value);
int delete_item(char *item);
int show(char *toml_path);

int main(int argc, char *argv[])
{

  int wrong_args = argc != 4 && (argc != 3 && strcmp(argv[1], "set") != 0);

  if (wrong_args)
  {
    usage();
    printf("argc: %d\n", argc);
    return 1;
  }

  if (strcmp(argv[1], "parse") == 0)
  {
    parse_json(argv[2]);
  }
  else if (strcmp(argv[1], "get") == 0)
  {
    get_item(argv[2]);
  }
  else if (strcmp(argv[1], "set") == 0)
  {
    set_item(argv[2], argv[3]);
  }
  else if (strcmp(argv[1], "delete") == 0)
  {
    delete_item(argv[2]);
  }
  else if (strcmp(argv[1], "show") == 0)
  {
    show(argv[2]);
  }
  else
  {
    usage();
    return 1;
  }

  return 0;
}

// parse toml to json
void parse_json(char *toml_path)
{
  printf("Parsing toml to json\n");
  printf("to be implemented\n");
  // FILE *fp;
  // fp = fopen(toml_path, "r");
  // char toml[1500];
  // fgets(toml, 1500, fp);
  // printf("%s\n", toml);
  // fclose(fp);
}

void get_item(char *item)
{
  printf("Getting item\n");
  printf("to be implemented\n");
}

void set_item(char *item, char *value)
{
  printf("Setting item\n");
  printf("to be implemented\n");
}

int delete_item(char *item)
{
  printf("Deleting item\n");
  printf("to be implemented\n");
}

int show(char *toml_path)
{
  printf("Showing toml\n");
  printf("to be implemented\n");
}

void usage()
{
  printf("Usage: packman-toml <do stuff> <on>\n");
  printf("stuff:\n\n");
  printf("    parse json\n\n");
  printf("    get <item>\n");
  printf("    set <item> <value>\n\n");
  printf("    item: name, author, desc, keywords, repo, dist\n\n");
  printf("    delete <item>\n\n");
  printf("    show\n");
  return;
}